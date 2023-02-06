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
    "Acs-Token":
      "1675584313980_1675658805590_u30LM1FFW8cEtKgfvq0kzbWSYrfK+bn1XO39/QqGSxpPVAQRSt8w8udSquJYBYCQXxjPJaTgDIMdglGU5eTzzIDIIPL4Uctg8kwqTGAlmhWD1J/hUHLqCB4aF9qx92IkuTiNTbDSGCQNiFo6s3Amvvd5sfiz1BDXFgHIUSxvyuN7POG97O0XFRZAOIDCK3fVF6j5PBLSeN+YmuiTVoOZp1Fq3ISjwMpLgLBWfziBYlyDKJgBhb/GFM3veUxBdt/AJTTYXA6dQFmrDKK3aapgCrjvOSfu3/GsxBBDPiVZQNaYw9GCNd/qiuq/qRGdcVyx",
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
    Cookie:
      "OUTFOX_SEARCH_USER_ID=498646259@10.110.96.153; OUTFOX_SEARCH_USER_ID_NCOO=518205455.63062",
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
