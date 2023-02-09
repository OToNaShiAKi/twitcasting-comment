<template>
  <v-card>
    <v-subheader>
      {{ $vuetify.lang.t("$vuetify.languages.resouces") }}
    </v-subheader>
    <v-radio-group
      class="ma-0 px-3"
      :value="$vuetify.lang.current"
      @change="ChangeLanguage"
    >
      <v-radio
        value="zhHans"
        :label="$vuetify.lang.t('$vuetify.languages.chinese')"
      />
      <v-radio
        value="ja"
        :label="$vuetify.lang.t('$vuetify.languages.japanses')"
      />
      <v-radio
        value="ko"
        :label="$vuetify.lang.t('$vuetify.languages.korean')"
      />
      <v-radio
        value="en"
        :label="$vuetify.lang.t('$vuetify.languages.english')"
      />
    </v-radio-group>
    <v-subheader>
      {{ $vuetify.lang.t("$vuetify.config.content") }}
    </v-subheader>
    <section class="px-3">
      <slot />
      <v-switch
        :label="$vuetify.lang.t('$vuetify.autoup')"
        v-model="auto"
        @change="AutoUp"
      />
    </section>
    <v-subheader>
      {{ $vuetify.lang.t("$vuetify.font") }}
    </v-subheader>
    <section class="px-3">
      <v-slider
        dense
        thumb-label="always"
        thumb-size="24"
        hide-details
        :max="range[1]"
        :min="range[0]"
        :value="size"
        @change="ChangeSize"
      />
      <v-file-input
        :label="$vuetify.lang.t('$vuetify.fontfile')"
        @change="ChangeFont"
      />
    </section>
    <v-subheader class="d-flex justify-space-between align-center">
      {{ $vuetify.lang.t("$vuetify.theme.title") }}
      <v-btn @click="ChangeMode" icon x-small>
        <v-icon color="primary">mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-subheader>
    <v-radio-group
      class="ma-0 px-3"
      :value="$vuetify.theme.themes.light.primary"
      @change="ChangeTheme"
    >
      <v-radio
        :label="$vuetify.lang.t('$vuetify.theme.pink')"
        value="#fa7298"
      />
      <v-radio
        :label="$vuetify.lang.t('$vuetify.theme.blue')"
        value="#2196f3"
      />
      <v-radio
        :label="$vuetify.lang.t('$vuetify.theme.brown')"
        value="#5c2e2e"
      />
      <v-radio
        :label="$vuetify.lang.t('$vuetify.theme.yellow')"
        value="#fd8a2f"
      />
      <v-radio :label="$vuetify.lang.t('$vuetify.theme.red')" value="#ff5252" />
      <v-radio
        :label="$vuetify.lang.t('$vuetify.theme.green')"
        value="#8bc24a"
      />
      <v-radio
        :label="$vuetify.lang.t('$vuetify.theme.purple')"
        value="#9c28b1"
      />
    </v-radio-group>
    <v-subheader class="caption">
      {{ $vuetify.lang.t("$vuetify.version") }}: {{ version }}
    </v-subheader>
  </v-card>
</template>

<script>
import Socket from "../plugins/socket";
import { version } from "../../package.json";
import { FontStyle } from "@/plugins/bilibili";

export default {
  name: "ConfigSetting",
  data: () => ({ version, range: FontStyle.size, auto: Socket.AutoUp }),
  props: { size: String },
  methods: {
    ChangeMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark", this.$vuetify.theme.dark ? 1 : 0);
    },
    ChangeLanguage(value) {
      this.$vuetify.lang.current = value;
      Socket.language = value;
      localStorage.setItem("language", value);
    },
    ChangeTheme(value) {
      this.$vuetify.theme.themes.light.primary = value;
      this.$vuetify.theme.themes.dark.primary = value;
      localStorage.setItem("theme", value);
    },
    ChangeFont(file) {
      if (FontStyle.face) {
        document.fonts.delete(FontStyle.face);
        FontStyle.face = null;
        localStorage.removeItem("fontface");
      }
      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", async ({ target }) => {
          FontStyle.face = new FontFace("CandyCustom", `url(${target.result})`);
          await FontStyle.face.load();
          document.fonts.add(FontStyle.face);
          localStorage.setItem("fontface", target.result);
        });
        reader.readAsDataURL(file);
      }
    },
    ChangeSize(size) {
      document.documentElement.style.fontSize = size + "px";
      localStorage.setItem("fontsize", size);
    },
    AutoUp(value) {
      Socket.AutoUp = value;
    },
  },
};
</script>
