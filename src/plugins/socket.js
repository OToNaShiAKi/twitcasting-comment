import { ipcRenderer } from "electron";
import { Certification, Colors, HandleMessage, Ships } from "./bilibili";
import GoTo from "vuetify/lib/services/goto";

export default class Socket {
  static Command = {
    comment: async (item) => {
      const translate = await ipcRenderer.invoke("Translate", item.message, Socket.language);
      return {
        id: item.id,
        title: item.author.name,
        avatar: item.author.profileImage,
        message: item.message,
        translate,
        style: {},
        config: "comment",
      };
    },
    DANMU_MSG: async ({ info, type }, uid) => {
      if (info[0][9]) return;
      const { emots } = JSON.parse(info[0][15].extra);
      let message = info[1];
      let config = "comment";
      if (emots) {
        const regexp = Object.keys(emots)
          .join("|")
          .replace(/\[|\]/g, (s) => "\\" + s);
        message = info[1].replace(new RegExp(regexp, "ig"), (s) => {
          const { url, width, height } = emots[s];
          return `<img src="${url}" width="${width}" height="${height}" />`;
        });
        info[1] = info[1].replace(new RegExp(regexp, "ig"), " ");
      } else if (info[0][12] === 1) {
        const { url, bulge_display } = info[0][13];
        message = `<img src="${url}" height="${bulge_display ? 40 : 20}" />`;
        info[1] = "";
        config = "stamp";
      }
      const [avatar, translate] = await Promise.all([
        ipcRenderer.invoke("GetAvatar", info[2][0]),
        ipcRenderer.invoke("Translate", info[1].trim(), Socket.language),
      ]);
      const color =
        (info[2][2] && Colors.Admin) ||
        info[2][7] ||
        (uid == info[2][0] && Colors.UP);
      const url = Ships[info[7]];
      if (url) {
        info[2][1] += `<img src="${url}" class="ml-2" width="20" height="20" />`;
      }
      return {
        id: type + "-" + info[0][4],
        message,
        title: info[2][1],
        avatar,
        translate,
        style: {
          title: color && { color },
          message: /【|】/.test(message) && { color: Colors.Translate },
        },
        config,
      };
    },
    SUPER_CHAT_MESSAGE_JPN: async ({ data, type }) => {
      const translate =
        data.message_jpn ||
        (await ipcRenderer.invoke("Translate", data.message, Socket.language));
      let title = `<span class="py-1">${data.user_info.uname}</span>`;
      const url = Ships[data.user_info.guard_level];
      if (url) {
        title += `<img src="${url}" class="ml-2" width="20" height="20" />`;
      }
      title += `<span class="ml-6" style="background-color: ${data.background_price_color};">SuperChat - ￥${data.price}</span>`;
      return {
        id: type + "-" + data.id,
        message: data.message,
        title,
        translate,
        avatar: data.user_info.face,
        style: {
          card: {
            backgroundColor: data.background_bottom_color,
            margin: "6px 0 6px 0",
          },
          title: { color: data.background_color },
          message: { color: data.background_color },
        },
        config: "superchat",
      };
    },
    GUARD_BUY: async ({ data, type }) => {
      const avatar = await ipcRenderer.invoke("GetAvatar", data.uid);
      const colors = Colors.Ship[data.guard_level];
      const url = Ships[data.guard_level];
      const price = (data.price / 1000).toFixed(0);
      return {
        id: type + "-" + Date.now(),
        avatar,
        title: data.username,
        translate: "New Member",
        message: `${data.gift_name} - <img src="${url}" class="ml-2" width="20" height="20" /><span>×${data.num}</span><span class="ml-6">￥${price}</span>`,
        style: {
          card: { backgroundColor: colors.background, margin: "6px 0 6px 0" },
          message: { color: colors.message },
          title: { color: colors.message },
        },
        config: "gift",
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
  static language = undefined;
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
  static GoToBottom = () => {
    const target = document.getElementById("comment");
    GoTo(target.scrollHeight, { easing: "easeInOutCubic" });
  };
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
