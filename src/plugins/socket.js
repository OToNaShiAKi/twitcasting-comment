import { ipcRenderer } from "electron";
import { Certification, HandleMessage } from "./bilibili";

export default class Socket {
  static Command = {
    comment: async (item) => {
      const translate = await ipcRenderer.invoke("Translate", item.message);
      return {
        id: item.id,
        nickname: item.author.name,
        avatar: item.author.profileImage,
        message: item.message,
        translate,
      };
    },
    DANMU_MSG: async ({ info }) => {
      const translate = await ipcRenderer.invoke("Translate", info[1]);
      return {
        message: info[1],
        nickname: info[2][1],
        translate,
        id: info[0][4],
      };
    },
    // SUPER_CHAT_MESSAGE: async ({ data}) => {
    //   const translate = await ipcRenderer.invoke("Translate", data.message);
    //   return {
    //     message: data.message,
    //     nickname: data.user_info.uname,
    //     translate,
    //     // id: Date.now(),
    //   };
    // },
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
    for (const item of messages) {
      const comment =
        Socket.Command[item.type] && (await Socket.Command[item.type](item));
      if (comment) {
        this.comments.push(comment);
        Socket.GoToBottom();
      }
    }
    Socket.Log(`SocketMessage - ${JSON.stringify(messages)}`);
  };
}
