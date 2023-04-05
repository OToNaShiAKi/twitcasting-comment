<template>
  <v-app>
    <v-system-bar app fixed height="30" />
    <v-main class="my-3">
      <v-card class="mb-3">
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
      <ConfigSetting />
    </v-main>
  </v-app>
</template>

<script>
import { ipcRenderer, shell } from "electron";
import Socket from "./plugins/socket";
import ConfigSetting from "./components/ConfigSetting.vue";

export default {
  name: "App",
  data: () => ({
    key: localStorage.getItem("key") || "",
    Twitcasting: localStorage.getItem("nick") || "",
    loading: false,
    hint: "",
    socket: null,
    connect: true,
    tab: localStorage.getItem("tab") || "Twitcasting",
    Bilibili: localStorage.getItem("roomid") || "",
  }),
  components: { ConfigSetting },
  async created() {
    const Cookie = localStorage.getItem("Cookie");
    const token = localStorage.getItem("token");
    const result = await ipcRenderer.invoke("GetAuthen", Cookie, token);
    localStorage.setItem("Cookie", result.Cookie);
    localStorage.setItem("token", result.token);
    shell.openExternal("http://localhost:9669/");
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
  background-color: transparent !important;
}
*::-webkit-scrollbar {
  width: 0;
}
.mdi-close::before {
  font-size: 18px !important;
}
#app .v-system-bar {
  -webkit-app-region: drag;
  -webkit-user-drag: none;
  border-radius: 4px;
  background-color: #fff;
}
</style>
