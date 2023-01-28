const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: ["github"],
        productName: "Twitcasting Comment",
        win: {
          icon: "./public/favicon.png",
          target: ["nsis"],
        },
        mac: { icon: "./public/favicon.png" },
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createStartMenuShortcut: true,
        },
      },
    },
  },
});
