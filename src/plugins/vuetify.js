import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import zhHans from "vuetify/lib/locale/zh-Hans";

Vue.use(Vuetify);

const dark = localStorage.getItem('dark') === '1';
const theme = '#fa7298';

export default new Vuetify({
  lang: {
    locales: { zhHans },
    current: "zhHans",
  },
  theme: {
    dark,
    themes: {
      light: { primary: theme },
      dark: { primary: theme },
    },
  },
});
