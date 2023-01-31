import axios from "axios";
import md5 from "blueimp-md5";
import QS from "qs";
import { e, Log } from "./util";

const Response = (response) => response.data;

const Twitcasting = axios.create({
  withCredentials: true,
  headers: {
    Origin: "https://en.twitcasting.tv",
    Referer: "https://en.twitcasting.tv/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  },
});
Twitcasting.interceptors.response.use(Response);

export const Baidu = axios.create({
  baseURL: "https://fanyi.baidu.com/",
  withCredentials: true,
  headers: {
    origin: "https://fanyi.baidu.com/",
    referer: "https://fanyi.baidu.com/",
    "Acs-Token":
      "1674893120600_1674896300648_JOcYq0eO+m3w8SFUV5QrP7oi8BQeLPya9oBStyUEzVKO7uFGIf8OSndBXS+Z6rTfZrcEsvigDrNdDyLpftZJcZ7W54VB+09919id8Hspzu6VqnezAtwgcqiFItekx1TgUP4zsC8G0/mdfupOihPpuS2Wo7uA9I436OxcmBT0IyCZuHcl97BxPG7eJUtcWzYnJbfqpXGEcN55fNAPXtTYSTKlN6Sd2H+wbEql2aQ1LMTw64rPwb2Ee3zpZcSq7SKc6UY0rMLePNpkpjK6SeLXWv8HLMWRHVlIn/L2Lx5IwS2HRwDZxq34oiNHZMQssdJcpaadhLP3vkrKitfxx4ACBg==",
    "sec-ch-ua":
      '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    Cookie:
      "BAIDUID_BFESS=94C5E31239813B1596FA15570BC5E899:FG=1; APPGUIDE_10_0_2=1; REALTIME_TRANS_SWITCH=1; FANYI_WORD_SWITCH=1; HISTORY_SWITCH=1; SOUND_SPD_SWITCH=1; SOUND_PREFER_SWITCH=1; BIDUPSID=94C5E31239813B1596FA15570BC5E899; PSTM=1672128844; ZFY=E5mikBzGXzrkiAwK6lSyRjTf6zSDj6ArJyIl2B0OmTQ:C; __bid_n=18586735d7bc6978cb4207; FPTOKEN=Vrra7RBwRH6q1NMuhYo8Xz+DQ6/INyVXjmuzcdqn/aEk8w61nT5tBDnuJwGHkAAe/3lk/wS5vkTmoDR9x4qMwaXCViE7iGNOnJBLHRqmluYpNmmeLI2U0u7XswAAKHeQtWfs0y6yClXIEaD5vMEXy2Gq5+Dwnn3OT+sl6bCMl9ZxrTaRUbGDU0+iIVFa0ZKDuMvjrf39Vd1ejFR7OeyiIgyhFSM+W0tpDJnTPPIuMg0ErFA+MJLMGZKkDoBVH+vM8QQuwhTSBbBl//evljfR3C3DXp7A3FOj64dLchvB1/hfk/53e6D6i7AEypr/lx8hiBliWIZJWH6PvIEHC2O38mqIQnu9+dEsRDw1GJzr85SJvtzzVtRf+ijWwDJ8IzGrBs+oA9QdBkHDLyOe69ZfyPUkFEeJU2i1BijA+qhIGjU=|HZ8C2OKBOY3XSFB7cKqIPeT5ycJkK9Pu/tytLJKBlso=|10|5827a7f85ce40166096df60d8e27093e; Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1674877163; H_PS_PSSID=36552_36920_37989_37797_37930_26350_37958_38009_37881; BA_HECTOR=21858g2k042420210gah04351ht9o2p1k; Hm_lpvt_64ecd82404c51e03dc91cb9e8c025574=1674895451; ab_sr=1.0.1_ZjY1OTM5YTQ5NzZhYmE2ZGUwYTI0YjliMmFmNjlhODNlZDQ3ZTA1NDNlOWExNzcxYjgwNzFhNDU0YzA0MDI2M2QxZTgyZTJiNDhjYzU4OThmZjMzNmMyODNkNDJjYmRmN2U3YzliNGQ1MWJjMjk3Zjg2N2ZmNzc0ODg0ZmQxNTU1ZWFmODk1YzMxNWNjMjhjNzBiZjA4YjQ3MzMwYmU4OA==",
  },
});
Baidu.interceptors.response.use(Response);

export const Bilibili = axios.create({
  withCredentials: true,
  headers: {
    origin: "https://live.bilibili.com",
    referer: "https://live.bilibili.com",
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
  const sign = e(query);
  Log(`Translate - sign:${sign} query:${query} to:${to}`);
  try {
    const { lan } = await Baidu.post("/langdetect", { query });
    if (lan !== to) {
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
          token: "0c08b3946d11e31ca2088766c3eab778",
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
  try {
    const { face } = await Bilibili.get("/x/space/wbi/acc/info", {
      baseURL: "https://api.bilibili.com/",
      params: { mid: uid, token: "", platform: "web" },
    });
    return face;
  } catch (error) {
    return null;
  }
};
