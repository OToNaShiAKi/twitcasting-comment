import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import ja from "vuetify/lib/locale/ja";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { ja },
    current: "ja",
  },
  theme: {
    themes: {
      light: { primary: "#fa7298" },
      dark: { primary: "#fa7298" },
    },
  },
});
