<template>
  <v-card>
    <v-subheader>
      {{ $vuetify.lang.t("$vuetify.languages.resouces") }}
    </v-subheader>
    <v-radio-group
      dense
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
      <v-switch
        :label="$vuetify.lang.t('$vuetify.autotranslate')"
        v-model="translate"
        @change="AutoTranslate"
        dense
      />
    </v-radio-group>
    <v-subheader>
      {{ $vuetify.lang.t("$vuetify.config.content") }}
    </v-subheader>
    <section class="px-3">
      <v-checkbox
        dense
        class="ma-0"
        value="comment"
        v-model="config"
        hide-details
        :label="$vuetify.lang.t('$vuetify.config.comment')"
        @change="ChangeConfig"
      />
      <v-checkbox
        dense
        class="ma-0"
        value="gift"
        v-model="config"
        hide-details
        @change="ChangeConfig"
        :label="$vuetify.lang.t('$vuetify.config.gift')"
      />
      <v-checkbox
        dense
        class="ma-0"
        value="member"
        v-model="config"
        hide-details
        @change="ChangeConfig"
        :label="$vuetify.lang.t('$vuetify.config.member')"
      />
      <v-checkbox
        dense
        class="ma-0"
        value="superchat"
        v-model="config"
        hide-details
        @change="ChangeConfig"
        :label="$vuetify.lang.t('$vuetify.config.superchat')"
      />
      <v-checkbox
        dense
        class="ma-0"
        value="stamp"
        v-model="config"
        hide-details
        @change="ChangeConfig"
        :label="$vuetify.lang.t('$vuetify.config.stamp')"
      />
      <v-switch
        :label="$vuetify.lang.t('$vuetify.autoup')"
        v-model="auto"
        @change="AutoUp"
        dense
      />
    </section>
    <v-subheader>
      {{ $vuetify.lang.t("$vuetify.font") }}
    </v-subheader>
    <section class="px-3">
      <v-slider
        dense
        prepend-icon="mdi-format-size"
        thumb-label="always"
        thumb-size="24"
        hide-details
        max="24"
        min="10"
        :value="size"
        @change="ChangeSize"
      />
      <v-select
        :loading="fonts.length <= 0"
        prepend-icon="mdi-format-font"
        dense
        clearable
        v-model="fontface"
        :items="fonts"
        @change="ChangeFont"
      >
        <template v-slot:item="{ item }">
          <span :style="{ fontFamily: item }">{{ item }}</span>
        </template>
      </v-select>
    </section>
    <v-subheader class="d-flex justify-space-between align-center">
      {{ $vuetify.lang.t("$vuetify.theme.title") }}
      <v-btn @click="ChangeMode" icon x-small>
        <v-icon color="primary">mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-subheader>
    <v-radio-group
      dense
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
import { ipcRenderer } from "electron";

export default {
  name: "ConfigSetting",
  data: () => ({
    version,
    auto: Socket.AutoUp,
    translate: Socket.AutoTranslate,
    fonts: [],
    fontface: "",
    config: ["comment", "gift", "member", "superchat", "stamp"],
    size: 16,
  }),
  async created() {
    this.size = localStorage.getItem("fontsize") || this.size;
    this.fonts = await ipcRenderer.invoke("GetFont");
    Socket.language = this.$vuetify.lang.current;
    const fontface = localStorage.getItem("fontface");
    if (fontface) document.getElementById("app").style.fontFamily = fontface;
    this.fontface = document.getElementById("app").style.fontFamily;

    ipcRenderer.send("Setting", {
      dark: this.$vuetify.theme.dark,
      language: this.$vuetify.lang.current,
      theme: this.$vuetify.theme.themes.light.primary,
      fontface: this.fontface,
      fontsize: this.size,
      AutoUp: Socket.AutoUp,
      AutoTranslate: Socket.AutoTranslate,
      config: this.config,
    });
  },
  methods: {
    ChangeMode() {
      const value = !this.$vuetify.theme.dark;
      this.$vuetify.theme.dark = value;
      ipcRenderer.send("Setting", { dark: value });
      localStorage.setItem("dark", value ? 1 : 0);
    },
    ChangeLanguage(value) {
      this.$vuetify.lang.current = value;
      Socket.language = value;
      ipcRenderer.send("Setting", { language: value });
      localStorage.setItem("language", value);
    },
    ChangeTheme(value) {
      this.$vuetify.theme.themes.light.primary = value;
      this.$vuetify.theme.themes.dark.primary = value;
      ipcRenderer.send("Setting", { theme: value });
      localStorage.setItem("theme", value);
    },
    ChangeFont(value) {
      document.getElementById("app").style.fontFamily = value;
      ipcRenderer.send("Setting", { fontface: value });
      if (value) localStorage.setItem("fontface", value);
      else localStorage.removeItem("fontface");
    },
    ChangeSize(value) {
      document.documentElement.style.fontSize = value + "px";
      ipcRenderer.send("Setting", { fontsize: value });
      localStorage.setItem("fontsize", value);
    },
    AutoUp(value) {
      ipcRenderer.send("Setting", { AutoUp: value });
      Socket.AutoUp = value;
    },
    AutoTranslate(value) {
      Socket.AutoTranslate = value;
      ipcRenderer.send("Setting", { AutoTranslate: value });
      localStorage.setItem("AutoTranslate", value);
    },
    ChangeConfig(value) {
      ipcRenderer.send("Setting", { config: value });
    },
  },
};
</script>
