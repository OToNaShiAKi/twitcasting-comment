import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import { ja, zhHans, ko, en } from "vuetify/lib/locale/";

const locales = Object.freeze({
  zhHans: {
    ...zhHans,
    link: "连接",
    languages: {
      resouces: "语言",
      japanses: "日语",
      chinese: "中文",
      english: "英语",
      korean: "韩语",
    },
    hint: "连接失败",
    theme: "主题色",
    version: "版本",
    config: {
      content: "内容",
      comment: "弹幕",
      gift: "礼物（开发中）",
      member: "会员",
      superchat: "醒目留言",
      stamp: "表情",
    },
  },
  ja: {
    ...ja,
    link: "接続",
    languages: {
      resouces: "言語",
      japanses: "日本語",
      chinese: "中国語",
      english: "英語",
      korean: "韓国語",
    },
    hint: "接続が失敗になりました",
    theme: "色彩",
    version: "バージョン",
    config: {
      content: "内容",
      comment: "弾幕",
      gift: "ギフト（開発中）",
      member: "メンバー",
      superchat: "スーパーチャット",
      stamp: "スタンプ",
    },
  },
  ko: {
    ...ko,
    link: "연결",
    languages: {
      resouces: "언어",
      japanses: "중국어",
      chinese: "일본어",
      english: "한국어",
      korean: "영어",
    },
    hint: "연결 오류",
    theme: "색상",
    version: "버전",
    config: {
      content: "내용",
      comment: "코멘트",
      gift: "선물（개발 중）",
      member: "회원",
      superchat: "슈퍼 채팅",
      stamp: "우표",
    },
  },
  en: {
    ...en,
    link: "Link",
    languages: {
      resouces: "Languages",
      japanses: "Japanses",
      chinese: "Chinese",
      english: "English",
      korean: "Korean",
    },
    hint: "Link Error",
    theme: "Theme",
    version: "Version",
    config: {
      content: "Content",
      comment: "Comment",
      gift: "Gift（Under development）",
      member: "Member",
      superchat: "Super Chat",
      stamp: "Stamp",
    },
  },
});

Vue.use(Vuetify);

const dark = localStorage.getItem("dark") === "1";
const theme = localStorage.getItem("theme") || "#fa7298";
const language = localStorage.getItem("language") || "ja";

export default new Vuetify({
  lang: { locales, current: language },
  theme: {
    dark,
    themes: {
      light: { primary: theme },
      dark: { primary: theme },
    },
  },
});
