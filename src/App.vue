<template>
  <v-app>
    <v-skeleton-loader
      id="skeleton"
      v-if="comments.length <= 0"
      type="list-item-avatar-three-line, list-item-avatar-two-line"
    />
    <v-main>
      <CommentList :comments="comments" :config="config" />
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
              (tab === 'Bilibili' && !Bilibili)
            "
            @click="Link"
          >
            {{ $vuetify.lang.t("$vuetify.link") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setting">
      <ConfigSetting>
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
      </ConfigSetting>
    </v-dialog>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import Socket from "./plugins/socket";
import ConfigSetting from "./components/ConfigSetting.vue";
import CommentList from "./components/CommentList.vue";

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
    config: ["comment", "gift", "member", "superchat", "stamp"],
  }),
  components: { ConfigSetting, CommentList },
  async beforeCreate() {
    const Cookie = localStorage.getItem("Cookie");
    const token = localStorage.getItem("token");
    const result = await ipcRenderer.invoke("GetAuthen", Cookie, token);
    localStorage.setItem("Cookie", result.Cookie);
    localStorage.setItem("token", result.token);
    Socket.language = this.$vuetify.lang.current;
    Socket.target = document.getElementById("comment");
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
