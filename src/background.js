"use strict";

import { app, protocol, BrowserWindow, Menu, ipcMain, screen } from "electron";
import { autoUpdater } from "electron-updater";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
import {
  GetMovie,
  Translate,
  GetAvatar,
  GetAuthen,
  Judgment,
} from "./plugins/axios";
import { Log } from "./plugins/util";
import md5 from "blueimp-md5";
import { Baidu, Youdao } from "./plugins/header";
import FontList from "font-list";
import io from "./plugins/server";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

const CreateWindow = async () => {
  Menu.setApplicationMenu(null);
  const { height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    // Create the browser window.
    width: 420,
    height: (height * 3) / 4,
    center: true,
    icon: "./public/favicon.png",
    alwaysOnTop: true,
    frame: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    transparent: true,
    titleBarOverlay: { color: "#ffffff00", symbolColor: "#808080" },
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify();
  }
};

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) CreateWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  CreateWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

const Avatars = {};
const Trasnslated = {};

ipcMain.handle("GetMovie", async (event, tab, ...parameter) => {
  const result = await GetMovie[tab](...parameter);
  io.emit("Socket", result);
  return result;
});
ipcMain.handle("Translate", async (event, text, to) => {
  const key = md5(text) + "-" + to;
  if (Trasnslated[key]) return Trasnslated[key];
  else if (/【|】|(^\d*$)/.test(text) || text.length <= 0) return null;
  const language = await Judgment(text, to);
  if (language === to) return null;
  const result = await Translate[Translate.times](text, language, to);
  Trasnslated[key] = result;
  Translate.times = (Translate.times + 1) % Translate.length;
  return result;
});
ipcMain.handle("GetAvatar", async (event, uid) => {
  const avatar = Avatars[uid] || (await GetAvatar(uid));
  Avatars[uid] = avatar;
  return avatar;
});
ipcMain.on("Log", (event, text) => Log(text));
ipcMain.handle("GetAuthen", async (event, Cookie, token, G) => {
  if (!Cookie || !token || !G) {
    const result = await GetAuthen();
    Cookie = result.Cookie;
    token = result.token;
    G = result.G;
  }
  Baidu.defaults.headers.Cookie = Cookie;
  Youdao.defaults.headers.Cookie = G;
  Translate.token = token;
  return { Cookie, token, G };
});
ipcMain.handle("GetFont", async (event) => {
  const result = await FontList.getFonts();
  return result.map((item) => item.replace(/^"|"$/g, ""));
});
ipcMain.on("Setting", (event, message) => {
  io.Setting = Object.assign(io.Setting, message);
  io.emit("Setting", message);
});
ipcMain.on("Comment", (event, message) => io.emit("Comment", message));
