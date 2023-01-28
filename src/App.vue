<template>
  <v-app>
    <v-main>
      <v-dialog :value="hint" persistent>
        <v-card>
          <v-card-title>コメント リンク</v-card-title>
          <v-card-text>
            <v-alert dense text v-show="hint" type="warning">{{ hint }}</v-alert>
            <v-text-field
              hide-details
              v-model="nick"
              label="ID"
              prepend-inner-icon="mdi-at"
            />
            <v-text-field hide-details v-model="key" label="Key"  />
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
      <v-skeleton-loader
        v-if="comments.length <= 0"
        type="list-item-avatar-three-line"
      />
      <v-list id="comment" three-line dense>
        <v-list-item dense v-for="item of comments" :key="item.id">
          <v-list-item-avatar>
            <v-img :src="item.avatar" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.nickname }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ item.translate }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-main>
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
  }),
  created() {
    this.key = localStorage.getItem("key");
    this.nick = localStorage.getItem("nick");
    if (this.key && this.nick) {
      this.link();
    }
  },
  methods: {
    async link() {
      this.loading = true;
      const nick = this.nick.toLowerCase();
      const result = await ipcRenderer.invoke("GetMovie", nick, this.key);
      this.socket && this.socket.socket.close();
      if (result) {
        this.socket = new Socket(result);
        this.comments = this.socket.comments;
        this.hint = false
      } else {
        this.hint = "接続が失敗になりました";
      }
      localStorage.setItem("key", this.key);
      localStorage.setItem("nick", this.nick);
      this.loading = false;
    },
  },
};
</script>

<style>
*::-webkit-scrollbar {
  width: 0;
}
</style>
