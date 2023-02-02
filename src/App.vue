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
    <v-btn @click="theme" fab fixed bottom right x-small>
      <v-icon color="primary">mdi-theme-light-dark</v-icon>
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
    key: localStorage.getItem("key") || "",
    Twitcasting: localStorage.getItem("nick") || "",
    loading: false,
    hint: "",
    socket: null,
    connect: true,
    tab: localStorage.getItem("tab") || "Twitcasting",
    Bilibili: localStorage.getItem("roomid") || "",
  }),
  methods: {
    async link() {
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
        this.hint = "接続が失敗になりました";
        this.connect = true;
      }
      localStorage.setItem("key", this.key);
      localStorage.setItem("nick", this.Twitcasting);
      localStorage.setItem("roomid", this.Bilibili);
      localStorage.setItem("tab", this.tab);
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
