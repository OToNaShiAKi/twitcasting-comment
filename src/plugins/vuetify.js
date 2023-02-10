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
    font: "字体",
    hint: "连接失败",
    autoup: "自动上浮",
    theme: {
      title: "主题色",
      pink: "少女粉",
      blue: "宝石蓝",
      brown: "咖啡褐",
      yellow: "咸蛋黄",
      red: "夕阳红",
      green: "早苗绿",
      purple: "罗兰紫",
    },
    version: "版本",
    config: {
      content: "内容",
      comment: "弹幕",
      gift: "礼物",
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
    autoup: "自動浮上",
    font: "フォント",
    hint: "接続が失敗になりました",
    theme: {
      title: "メイン色",
      pink: "少女ピンク",
      blue: "宝石青",
      brown: "コーヒー褐",
      yellow: "塩黄身金",
      red: "夕方赤",
      green: "春苗緑",
      purple: "スミレ紫",
    },
    version: "バージョン",
    config: {
      content: "内容",
      comment: "コメント",
      gift: "ギフト",
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
      japanses: "일본어",
      chinese: "중국어",
      english: "영어",
      korean: "한국어",
    },
    font: "문자",
    autoup: "자동 상승",
    hint: "연결 오류",
    theme: {
      title: "색상",
      pink: "티클미 핑크",
      blue: "크리스탈 블루",
      brown: "커피색",
      yellow: "난황색",
      red: "석양같은 붉은색",
      green: "사나에 의 초록색",
      purple: "스토크 보라색",
    },
    version: "버전",
    config: {
      content: "내용",
      comment: "코멘트",
      gift: "선물",
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
    autoup: "Automatic Floating",
    font: "Font",
    theme: {
      title:"Theme",
      pink: "Maiden pink",
      blue: "Sapphire blue",
      brown: "Coffee brown",
      yellow: "Salted egg yellow",
      red: "Sunset red",
      green: "Early seedling green",
      purple: "Violet purple",
    },
    version: "Version",
    config: {
      content: "Content",
      comment: "Comment",
      gift: "Gift",
      member: "Membzer",
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
