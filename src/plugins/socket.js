import { ipcRenderer } from "electron";
import { Certification, Colors, HandleMessage, Ships } from "./bilibili";

export default class Socket {
  static Command = {
    comment: async (item, uid) => {
      const { message } = item;
      const translate = await Socket.Translate(message);
      return {
        id: item.id,
        title: item.author.name,
        avatar: item.author.profileImage,
        message,
        translate,
        style: {
          title: uid === item.author.id && { color: Colors.UP },
          message: /【|】/.test(message) && { color: Colors.Translate },
        },
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
        Socket.Translate(info[1].trim()),
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
        data.message_jpn || (await Socket.Translate(data.message));
      let title = `<span class="py-1">${data.user_info.uname}</span>`;
      const url = Ships[data.user_info.guard_level];
      if (url) {
        title += `<img src="${url}" class="ml-2" width="20" height="20" />`;
      }
      title += `<span class="ml-6" style="color: ${data.background_price_color};">SuperChat - ￥${data.price}</span>`;
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
        config: "member",
      };
    },
    SEND_GIFT: async ({ data, type }) => {
      if (data.coin_type !== "gold") return;
      const number =
        (data.batch_combo_send && data.batch_combo_send.batch_combo_num) ||
        data.num;
      const price = (data.price * number) / 1000;
      const { url } = Socket.Gifts.find(({ id }) => data.giftId == id);
      const message = `${data.giftName} - <img src="${url}" class="ml-2" width="40" height="40" /><span>×${number}</span><span class="ml-6">￥${price}</span>`;
      const result = {
        id: type + "-" + data.tid,
        title: data.uname,
        avatar: data.face,
        translate: "Gift",
        batch_combo_id: data.batch_combo_id,
        message,
        config: "gift",
        style: { message: { color: Colors.Gift } },
      };
      return result;
    },
  };
  static AutoUp = true;
  static AutoTranslate = localStorage.getItem("AutoTranslate") !== "false";
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
  static Gifts = [];
  constructor(type, host) {
    this.socket = new WebSocket(host.host);
    this.socket.timer = null;
    this.type = type;
    this.uid = host.uid;
    Socket.Gifts = host.gifts;
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
    Socket.Log(`Socket Connect - ${text}`);
  };
  static Log = (text) => ipcRenderer.send("Log", text);
  static Translate = (text) =>
    Socket.AutoTranslate
      ? ipcRenderer.invoke("Translate", text, Socket.language)
      : "";
  Message = async ({ data }) => {
    const messages = await Socket.Parse[this.type](data);
    Socket.Log(`Socket Message - ${JSON.stringify(messages)}`);
    for (const item of messages) {
      const comment =
        Socket.Command[item.type] &&
        (await Socket.Command[item.type](item, this.uid));
      comment && ipcRenderer.send("Comment", comment);
    }
  };
}
