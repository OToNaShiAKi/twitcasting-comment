<template>
  <v-app>
    <v-skeleton-loader
      id="skeleton"
      v-if="comments.length <= 0"
      type="list-item-avatar-three-line, list-item-avatar-two-line"
    />
    <v-main>
      <v-list id="comment" dense three-line>
        <v-fab-transition group origin="center left">
          <v-list-item
            class="rounded-lg"
            :style="item.style.card"
            v-for="item of comments"
            :key="item.id"
            v-show="config.includes(item.config)"
          >
            <v-list-item-avatar>
              <v-img referrepolicy="no-referrer" :src="item.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                class="d-flex align-center font-weight-bold"
                :style="item.style.title"
                v-html="item.title"
              />
              <v-list-item-subtitle
                class="d-flex align-center"
                :style="item.style.message"
                v-html="item.message"
              />
              <v-list-item-subtitle :style="item.style.message">
                {{ item.translate }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-fab-transition>
      </v-list>
    </v-main>
    <v-btn class="drag" fab fixed top right x-small color="primary">
      <v-icon>mdi-cursor-move</v-icon>
    </v-btn>
    <v-btn @click="setting = !setting" fab fixed bottom right x-small>
      <v-icon color="primary">mdi-cogs</v-icon>
    </v-btn>
    <v-dialog v-model="connect" persistent>
      <v-card>
        <v-card-title>
          <v-tabs v-model="tab" centered>
            <v-tab href="#Twitcasting">Twitcasting</v-tab>
            <v-tab href="#Bilibili">Bilibili</v-tab>
          </v-tabs>
        </v-card-title>
        <v-card-text>
          <v-alert dense text v-show="hint" type="warning">
            {{ hint }}
          </v-alert>
          <v-tabs-items class="pb-1" v-model="tab">
            <v-tab-item value="Twitcasting">
              <v-text-field
                hide-details
                v-model="Twitcasting"
                label="ID"
                prepend-icon="mdi-at"
              />
              <v-text-field
                hide-details
                v-model="key"
                label="Key"
                prepend-icon="mdi-key-wireless"
              />
            </v-tab-item>
            <v-tab-item value="Bilibili">
              <v-text-field
                hide-details
                v-model="Bilibili"
                label="LiveID"
                prepend-icon="mdi-video"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            :loading="loading"
            color="primary"
            :disabled="
              (tab === 'Twitcasting' && !(Twitcasting && key)) ||
              (tab === 'Bilibili' && !Twitcasting)
            "
            @click="Link"
          >
            {{ $vuetify.lang.t("$vuetify.link") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setting">
      <v-card>
        <v-subheader>
          {{ $vuetify.lang.t("$vuetify.languages.resouces") }}
        </v-subheader>
        <v-radio-group
          row
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
        <v-subheader class="d-flex justify-space-between align-center">
          {{ $vuetify.lang.t("$vuetify.theme") }}
          <v-btn @click="ChangeMode" icon x-small>
            <v-icon color="primary">mdi-theme-light-dark</v-icon>
          </v-btn>
        </v-subheader>
        <v-radio-group
          row
          class="ma-0 px-3"
          :value="$vuetify.theme.themes.light.primary"
          @change="ChangeTheme"
        >
          <v-radio label="少女粉" value="#fa7298" />
          <v-radio label="宝石蓝" value="#2196f3" />
          <v-radio label="咖啡褐" value="#5c2e2e" />
          <v-radio label="咸蛋黄" value="#fd8a2f" />
          <v-radio label="夕阳红" value="#ff5252" />
          <v-radio label="早苗绿" value="#8bc24a" />
          <v-radio label="罗兰紫" value="#9c28b1" />
        </v-radio-group>
        <v-subheader>
          {{ $vuetify.lang.t("$vuetify.config.content") }}
        </v-subheader>
        <section class="px-3 pb-3 d-flex flex-wrap justify-space-between">
          <v-checkbox
            class="ma-0"
            value="comment"
            v-model="config"
            hide-details
            :label="$vuetify.lang.t('$vuetify.config.comment')"
          />
          <v-checkbox
            class="ma-0"
            value="gift"
            v-model="config"
            disabled
            hide-details
            :label="$vuetify.lang.t('$vuetify.config.gift')"
          />
          <v-checkbox
            class="ma-0"
            value="member"
            v-model="config"
            hide-details
            :label="$vuetify.lang.t('$vuetify.config.member')"
          />
          <v-checkbox
            class="ma-0"
            value="superchat"
            v-model="config"
            hide-details
            :label="$vuetify.lang.t('$vuetify.config.superchat')"
          />
          <v-checkbox
            class="ma-0"
            value="stamp"
            v-model="config"
            hide-details
            :label="$vuetify.lang.t('$vuetify.config.stamp')"
          />
        </section>
        <v-subheader class="caption">
          {{ $vuetify.lang.t("$vuetify.version") }}: {{ version }}
        </v-subheader>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import Socket from "./plugins/socket";
import { version } from "../package.json";

export default {
  name: "App",
  data: () => ({
    comments: [],
    key: localStorage.getItem("key") || "",
    Twitcasting: localStorage.getItem("nick") || "",
    loading: false,
    hint: "",
    socket: null,
    connect: true,
    tab: localStorage.getItem("tab") || "Twitcasting",
    Bilibili: localStorage.getItem("roomid") || "",
    setting: false,
    config: ["comment", "member", "superchat", "stamp"],
    version,
  }),
  async beforeCreate() {
    const Cookie = localStorage.getItem("Cookie");
    const token = localStorage.getItem("token");
    const result = await ipcRenderer.invoke("GetAuthen", Cookie, token);
    localStorage.setItem("Cookie", result.Cookie);
    localStorage.setItem("token", result.token);
    Socket.language = this.$vuetify.lang.current;
  },
  methods: {
    async Link() {
      this.loading = true;
      this.socket && this.socket.socket.close();
      const result = await ipcRenderer.invoke(
        "GetMovie",
        this.tab,
        this[this.tab].toLowerCase(),
        this.key
      );
      if (result) {
        this.socket = new Socket(this.tab, result);
        this.comments = this.socket.comments;
        this.hint = "";
        this.connect = false;
      } else {
        this.hint = this.$vuetify.lang.t("$vuetify.hint");
        this.connect = true;
      }
      localStorage.setItem("key", this.key);
      localStorage.setItem("nick", this.Twitcasting);
      localStorage.setItem("roomid", this.Bilibili);
      localStorage.setItem("tab", this.tab);
      this.loading = false;
    },
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
  },
};
</script>

<style>
.drag {
  -webkit-app-region: drag;
  -webkit-user-drag: none;
}
#app {
  position: relative;
}
#app,
#skeleton > div,
.v-list {
  background-color: transparent !important;
}
*::-webkit-scrollbar {
  width: 0;
}
</style>
