import axios from "axios";
import md5 from "blueimp-md5";
import QS from "qs";
import { e, Log, y } from "./util";
import { Bilibili, Twitcasting, Baidu, LanguageMap, Youdao } from "./header";

export const GetMovie = {
  Bilibili: async (roomid) => {
    Log(`GetMovie Bilibili - roomid:${roomid}`);
    try {
      const [{ host_list, token }, { uid }] = await Promise.all([
        Bilibili.get("/xlive/web-room/v1/index/getDanmuInfo", {
          params: { type: 0, id: roomid },
          baseURL: "https://api.live.bilibili.com/",
        }),
        Bilibili.get("/xlive/web-room/v2/index/getRoomPlayInfo", {
          params: {
            room_id: roomid,
            protocol: "0,1",
            format: "0,1,2",
            codec: "0,1",
            qn: 0,
            platform: "web",
            ptype: 8,
            dolby: 5,
            panorama: 1,
          },
          baseURL: "https://api.live.bilibili.com/",
        }),
      ]);
      const host = host_list[host_list.length - 1];
      Log(`GetMovie Success - host:${JSON.stringify(host_list)} token:${token}`);
      return {
        host: `wss://${host.host}:${host.wss_port}/sub`,
        token,
        roomid,
        uid,
      };
    } catch (error) {
      Log(`GetMovie Error - ${JSON.stringify(error)}`);
      return null;
    }
  },
  Twitcasting: async (nick, key) => {
    const password = md5(key);
    Log(`GetMovie Twitcasting - nick:${nick} key:${key} password:${password}`);
    try {
      const {
        movie: { id },
      } = await Twitcasting.get(`/users/${nick}/latest-movie`, {
        baseURL: "https://frontendapi.twitcasting.tv",
        params: { pass: password },
      });
      const { url } = await Twitcasting.post(
        "eventpubsuburl.php",
        QS.stringify({ movie_id: id, password }),
        { baseURL: "https://en.twitcasting.tv/" }
      );
      Log(`GetMovie Success - id:${id} url:${url}`);
      return { host: url, uid: nick };
    } catch (error) {
      Log(`GetMovie Error - ${JSON.stringify(error)}`);
      return null;
    }
  },
};

export const Judgment = async (query, to) => {
  Log(`Judgment - query:${query}`);
  try {
    let { lan } = await Baidu.post("/langdetect", { query });
    for (const key in LanguageMap.Baidu) {
      if (lan === LanguageMap.Baidu[key]) {
        lan = key;
        break;
      }
    }
    Log(`Judgment Success - lan:${lan}`);
    return lan;
  } catch(error) {
    Log(`Judgment Error - ${JSON.stringify(error)}`);
    return to;
  }
};

export const Translate = [
  async (query, from = "zhHans", to = "ja") => {
    from = LanguageMap.Youdao[from] || from;
    to = LanguageMap.Youdao[to] || to;
    const token = y(query, Youdao.defaults.headers["User-Agent"]);
    Log(`Translate Youdao - sign:${JSON.stringify(token)} query:${query}`);
    try {
      const {
        translateResult: [[{ tgt }]],
      } = await Youdao.post(
        "/translate_o",
        QS.stringify({
          i: query,
          from,
          to,
          smartresult: "dict",
          client: "fanyideskweb",
          ...token,
          doctype: "json",
          version: "2.1",
          keyfrom: "fanyi.web",
          action: "FY_BY_REALTlME",
        })
      );
      Log(`Translate Success - tgt:${tgt}`);
      return tgt;
    } catch (error) {
      Log(`Translate Error - ${JSON.stringify(error)}`);
      return null;
    }
  }
];
Translate.times = 0;

export const GetAvatar = async (uid) => {
  Log(`GetAvatar - uid:${uid}`);
  try {
    const { face } = await Bilibili.get("/x/space/wbi/acc/info", {
      baseURL: "https://api.bilibili.com/",
      params: { mid: uid, token: "", platform: "web" },
    });
    Log(`GetAvatar Success - face:${face}`);
    return face;
  } catch (error) {
    Log(`GetAvatar Error - ${JSON.stringify(error)}`);
    return null;
  }
};

export const GetAuthen = async () => {
  try {
    const { headers } = await axios.get("https://fanyi.baidu.com");
    let Cookie = headers["set-cookie"]
      .map((item) => item.split(";")[0])
      .join("; ");
    const result = await axios.get("https://fanyi.baidu.com", {
      headers: { ...Baidu.defaults.headers, Cookie },
      withCredentials: true,
    });
    if (result.headers["set-cookie"]) {
      Cookie += "; ";
      Cookie += result.headers["set-cookie"]
        .map((item) => item.split(";")[0])
        .join(";");
    }
    const match = result.data.match(/token: ?'(.*)'/);
    Log(`GetAuthen Success - Cookie:${Cookie} token:${match[1]}`);
    return { Cookie, token: match[1] };
  } catch (error) {
    Log(`GetAuthen Error - ${JSON.stringify(error)}`);
  }
};
