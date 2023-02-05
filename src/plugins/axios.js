import axios from "axios";
import md5 from "blueimp-md5";
import QS from "qs";
import { e, Log } from "./util";

const Twitcasting = axios.create({
  withCredentials: true,
  headers: {
    Origin: "https://en.twitcasting.tv",
    Referer: "https://en.twitcasting.tv/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  },
});
Twitcasting.interceptors.response.use((response) => response.data);

export const Baidu = axios.create({
  baseURL: "https://fanyi.baidu.com/",
  withCredentials: true,
  headers: {
    origin: "https://fanyi.baidu.com/",
    referer: "https://fanyi.baidu.com/",
    "sec-ch-ua":
      '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  },
});
Baidu.interceptors.response.use(({ data }) => {
  if (data.error && data.error !== 0) {
    throw data;
  }
  return data;
});

const Bilibili = axios.create({
  withCredentials: true,
  headers: {
    Origin: "https://live.bilibili.com",
    Referer: "https://live.bilibili.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
  },
});
Bilibili.interceptors.response.use(({ data }) => {
  if (data.code !== 0 && data.code !== 1200000) {
    throw data;
  }
  data.data.message = data.message || data.msg;
  return data.data;
});

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
      Log(`GetMovieSuccess - host:${JSON.stringify(host_list)} token:${token}`);
      return {
        host: `wss://${host.host}:${host.wss_port}/sub`,
        token,
        roomid,
        uid,
      };
    } catch (error) {
      Log(`GetMovieError - ${JSON.stringify(error)}`);
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
      Log(`GetMovieSuccess - id:${id} url:${url}`);
      return { host: url, uid: nick };
    } catch (error) {
      Log(`GetMovieError - ${JSON.stringify(error)}`);
      return null;
    }
  },
};

export const Translate = async (query, to = "jp") => {
  try {
    const { lan } = await Baidu.post("/langdetect", { query });
    if (lan !== to) {
      const sign = e(query);
      Log(`Translate - sign:${sign} query:${query} to:${to}`);
      const {
        trans_result: {
          data: [{ dst }],
        },
      } = await Baidu.post(
        "/v2transapi",
        QS.stringify({
          from: lan,
          to,
          query,
          transtype: "realtime",
          simple_means_flag: 3,
          sign,
          token: Translate.token,
          domain: "common",
        })
      );
      Log(`TranslateSuccess - lan:${lan} dst:${dst}`);
      return dst;
    }
    return null;
  } catch (error) {
    Log(`TranslateError - ${JSON.stringify(error)}`);
    return null;
  }
};

export const GetAvatar = async (uid) => {
  Log(`GetAvatar - uid:${uid}`);
  try {
    const { face } = await Bilibili.get("/x/space/wbi/acc/info", {
      baseURL: "https://api.bilibili.com/",
      params: { mid: uid, token: "", platform: "web" },
    });
    Log(`GetAvatarSuccess - face:${face}`);
    return face;
  } catch (error) {
    Log(`GetAvatarError - ${JSON.stringify(error)}`);
    return null;
  }
};

export const GetAuthen = async () => {
  try {
    const { headers } = await axios.get("https://fanyi.baidu.com");
    let Cookie = headers["set-cookie"]
      .map((item) => item.split(";")[0])
      .join(";");
    const result = await axios.get("https://fanyi.baidu.com", {
      headers: { ...Baidu.defaults.headers, Cookie },
      withCredentials: true,
    });
    if (result.headers["set-cookie"]) {
      Cookie += ";";
      Cookie += result.headers["set-cookie"]
        .map((item) => item.split(";")[0])
        .join(";");
    }
    const match = result.data.match(/token: ?'(.*)'/);
    Log(`GetAuthenSuccess - Cookie:${Cookie} token:${match[1]}`);
    return { Cookie, token: match[1] };
  } catch (error) {
    Log(`GetAuthenError - ${JSON.stringify(error)}`);
  }
};
