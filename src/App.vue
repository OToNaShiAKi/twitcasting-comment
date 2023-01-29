<template>
  <v-app>
    <v-skeleton-loader
      id="skeleton"
      v-if="comments.length <= 0"
      type="list-item-avatar-three-line, list-item-avatar-two-line"
    />
    <v-main>
      <v-list id="comment" dense three-line>
        <v-fab-transition group>
          <v-list-item dense three-line v-for="item of comments" :key="item.id">
            <v-list-item-avatar>
              <v-img :src="item.avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ item.nickname }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ item.translate }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-fab-transition>
      </v-list>
    </v-main>
    <v-btn class="drag" fab fixed top right x-small color="primary">
      <v-icon>mdi-cursor-move</v-icon>
    </v-btn>
    <v-btn @click="theme" fab fixed bottom right x-small>
      <v-icon color="primary">mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-dialog v-model="connect" persistent>
      <v-card>
        <v-card-title>コメント接続</v-card-title>
        <v-card-text>
          <v-alert dense text v-show="hint" type="warning">
            {{ hint }}
          </v-alert>
          <v-text-field
            hide-details
            v-model="nick"
            label="ID"
            prepend-icon="mdi-at"
          />
          <v-text-field
            hide-details
            v-model="key"
            label="Key"
            prepend-icon="mdi-key-wireless"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            :loading="loading"
            color="primary"
            :disabled="!(nick && key)"
            @click="link"
          >
            リンク
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import Socket from "./plugins/socket";
// 1gyfuy
export default {
  name: "App",
  data: () => ({
    comments: [],
    key: "",
    nick: "",
    loading: false,
    hint: "",
    socket: null,
    connect: false,
  }),
  created() {
    Socket.GoToBottom = () => {
      const scroll = 76 * (this.comments.length + 1);
      this.$vuetify.goTo(scroll, { easing: "easeInOutCubic" });
    };
    this.key = localStorage.getItem("key");
    this.nick = localStorage.getItem("nick");
    if (this.key && this.nick) {
      this.link();
    } else {
      this.connect = true;
    }
  },
  methods: {
    async link() {
      this.loading = true;
      const nick = this.nick.toLowerCase();
      this.socket && this.socket.socket.close();
      const result = await ipcRenderer.invoke("GetMovie", nick, this.key);
      if (result) {
        this.socket = new Socket(result);
        this.comments = this.socket.comments;
        this.hint = "";
        this.connect = false;
      } else {
        this.hint = "接続が失敗になりました";
      }
      localStorage.setItem("key", this.key);
      localStorage.setItem("nick", this.nick);
      this.loading = false;
    },
    theme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark", this.$vuetify.theme.dark ? 1 : 0);
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
