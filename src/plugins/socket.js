import { ipcRenderer } from "electron";

export default class Socket {
  static Command = {
    comment: async (item) => {
      const translate = /【.*】/.test(item.message)
        ? ""
        : await ipcRenderer.invoke("Translate", item.message);
      return {
        id: item.id,
        nickname: item.author.name,
        avatar: item.author.profileImage,
        message: item.message,
        translate,
      };
    },
  };
  constructor(host) {
    this.comments = [];
    this.socket = new WebSocket(host);
    this.socket.addEventListener("open", (event) => {
      const text = JSON.stringify({
        trusted: event.isTrusted,
        url: event.target.url,
        type: event.type,
        state: event.target.readyState,
      });
      this.Log(`SocketOpen - ${text}`);
    });
    this.socket.addEventListener("message", this.Message);
    this.socket.addEventListener("close", (event) => {
      const text = JSON.stringify({
        trusted: event.isTrusted,
        url: event.target.url,
        type: event.type,
        state: event.target.readyState,
        reason: event.reason,
      });
      this.Log(`SocketClose - ${text}`);
    });
  }
  Log = (text) => ipcRenderer.send("Log", text);
  Message = async ({ data }) => {
    const messages = JSON.parse(data);
    for (const item of messages) {
      const comment =
        Socket.Command[item.type] && (await Socket.Command[item.type](item));
      if (comment) {
        this.comments.push(comment);
        Socket.GoToBottom();
      }
    }
    this.Log(`SocketMessage - ${data}`);
  };
}
