import { ipcRenderer } from "electron";

export default class Socket {
  static Command = {
    comment: async (item) => {
      let translate = "";
      if (!/【.*】/.test(item.message)) {
        translate = await ipcRenderer.invoke("Translate", item.message);
      }
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
    this.socket.addEventListener("open", console.log);
    this.socket.addEventListener("message", this.Message);
    this.socket.addEventListener("close", console.log);
  }
  Message = async ({ data }) => {
    const messages = JSON.parse(data);
    for (const item of messages) {
      const comment =
        Socket.Command[item.type] && (await Socket.Command[item.type](item));
      if (comment) {
        this.comments.unshift(comment);
      }
    }
  };
}
