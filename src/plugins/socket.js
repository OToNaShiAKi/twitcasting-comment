import { ipcRenderer } from "electron";
import { Certification, Colors, HandleMessage, Ships } from "./bilibili";

export default class Socket {
  static Command = {
    comment: async (item) => {
      const translate = await ipcRenderer.invoke("Translate", item.message);
      return {
        id: item.id,
        title: item.author.name,
        avatar: item.author.profileImage,
        message: item.message,
        translate,
        style: {},
      };
    },
    DANMU_MSG: async ({ info }, uid) => {
      const { emots } = JSON.parse(info[0][15].extra);
      let message = info[1];
      if (emots) {
        const regexp = Object.keys(emots)
          .join("|")
          .replace(/\[|\]/g, (s) => "\\" + s);
        message = info[1].replace(new RegExp(regexp, "ig"), (s) => {
          const { url, width, height } = emots[s];
          return `<img src="${url}" width="${width}" height="${height}" />`;
        });
        info[1] = info[1].replace(new RegExp(regexp, "ig"), " ");
      } else if (typeof info[0][13] === "object") {
        const { url, bulge_display } = info[0][13];
        message = `<img src="${url}" height="${bulge_display ? 40 : 20}" />`;
        info[1] = "";
      }
      const [avatar, translate] = await Promise.all([
        ipcRenderer.invoke("GetAvatar", info[2][0]),
        ipcRenderer.invoke("Translate", info[1].trim()),
      ]);
      const color =
        info[2][7] ||
        (info[2][2] && Colors.Admin) ||
        (uid == info[2][0] && Colors.UP);
      if(Ships[info[2][7]]) {
        info[2][1] += `<img src="${Ships[info[2][7]]}" class="ml-2" width="20" height="20"  />`
      }
      return {
        id: info[0][4],
        message,
        title: info[2][1],
        avatar,
        translate,
        style: {
          title: color && { color },
          message: /【.*】/.test(message) && { color: Colors.Translate },
        },
      };
    },
    SUPER_CHAT_MESSAGE_JPN: async ({ data }) => {
      const translate =
        data.message_jpn ||
        (await ipcRenderer.invoke("Translate", data.message));
      return {
        id: data.id,
        message: data.message,
        title: `<span class="py-1">${data.user_info.uname}</span><span class="ml-6">￥${data.price}</span>`,
        translate,
        avatar: data.user_info.face,
        style: {
          card: { backgroundColor: "#2A60B2", margin: "6px 0 6px 0" },
          title: { color: "#EDF5FF" },
          message: { color: "#EDF5FF" },
        },
      };
    },
  };
  static Parse = {
    Twitcasting: (data) => JSON.parse(data),
    Bilibili: (data) => new Promise((resolve) => HandleMessage(data, resolve)),
  };
  static Connect = {
    Bilibili: (socket, { roomid, token }) => {
      socket.send(
        Certification(
          JSON.stringify({
            uid: 0,
            roomid: +roomid,
            protover: 3,
            platform: "web",
            type: 2,
            key: token,
          })
        )
      );
      clearInterval(socket.timer);
      socket.timer = setInterval(() => {
        const buffer = new ArrayBuffer(16);
        const i = new DataView(buffer);
        i.setUint32(0, 0);
        i.setUint16(4, 16);
        i.setUint16(6, 1);
        i.setUint32(8, 2);
        i.setUint32(12, 1);
        socket.send(buffer);
      }, 30000);
    },
  };
  constructor(type, host) {
    this.comments = [];
    this.socket = new WebSocket(host.host);
    this.socket.timer = null;
    this.type = type;
    this.uid = host.uid;
    this.socket.addEventListener("open", (event) => {
      Socket.Connect[type] && Socket.Connect[type](this.socket, host);
      Socket.ConnectLog(event, type);
    });
    this.socket.addEventListener("message", this.Message);
    this.socket.addEventListener("close", (event) => {
      clearInterval(this.socket.timer);
      Socket.ConnectLog(event, type);
    });
  }
  static ConnectLog = (event, platform) => {
    const text = JSON.stringify({
      trusted: event.isTrusted,
      url: event.target.url,
      type: event.type,
      state: event.target.readyState,
      reason: event.reason,
      platform,
    });
    Socket.Log(`SocketConnect - ${text}`);
  };
  static Log = (text) => ipcRenderer.send("Log", text);
  Message = async ({ data }) => {
    const messages = await Socket.Parse[this.type](data);
    Socket.Log(`SocketMessage - ${JSON.stringify(messages)}`);
    for (const item of messages) {
      const comment =
        Socket.Command[item.type] &&
        (await Socket.Command[item.type](item, this.uid));
      if (comment) {
        this.comments.push(comment);
        Socket.GoToBottom();
      }
    }
  };
}
