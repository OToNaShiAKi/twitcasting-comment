import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import ja from "vuetify/lib/locale/ja";

Vue.use(Vuetify);

const dark = localStorage.getItem('dark') === '1';
const theme = '#fa7298';

export default new Vuetify({
  lang: {
    locales: { ja },
    current: "ja",
  },
  theme: {
    dark,
    themes: {
      light: { primary: theme },
      dark: { primary: theme },
    },
  },
});
