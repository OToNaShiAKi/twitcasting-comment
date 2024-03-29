import axios from "axios";

export const Twitcasting = axios.create({
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
    Origin: "https://fanyi.baidu.com/",
    Referer: "https://fanyi.baidu.com/",
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

export const Bilibili = axios.create({
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

export const Youdao = axios.create({
  baseURL: "https://fanyi.youdao.com/",
  withCredentials: true,
  headers: {
    Origin: "https://fanyi.youdao.com",
    Referer: "https://fanyi.youdao.com",
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
Youdao.interceptors.response.use(({ data }) => {
  if (data.errorCode !== 0) {
    throw data;
  }
  return data;
});

export const LanguageMap = Object.freeze({
  Baidu: { ja: "jp", zhHans: "zh", en: "en", ko: "kor" },
  Youdao: { ja: "ja", zhHans: "zh-CHS", en: "en", ko: "ko" },
});
