"use strict";
const electron = require("electron");
const path = require("path");
const os = require("os");
const pkg = require("../../../../package.json");
let updateWindow = undefined;

function getWindow() {
    return updateWindow;
}

function destroyWindow() {
    if (!updateWindow) return;
    updateWindow.close();
    updateWindow = undefined;
}

function createWindow() {
    destroyWindow();
    updateWindow = new electron.BrowserWindow({
        title: pkg.preductname,
        width: 1400,
        height: 815,
        minWidth: 1034,
        minHeight: 815,
        resizable: true,
        icon: `./src/assets/images/icon.${os.platform() === "win32" ? "ico" : "png"}`,
        transparent: false,
        frame: os.platform() !== 'win32',
        show: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webviewTag: true,
        },
    });
    electron.Menu.setApplicationMenu(null);
    updateWindow.setMenuBarVisibility(false);
    updateWindow.loadFile(path.join(electron.app.getAppPath(), 'src', 'launcher.html'));
    updateWindow.once('ready-to-show', () => {
        if (updateWindow) {
            updateWindow.show();
        }
    });
}

module.exports = {
    getWindow,
    createWindow,
    destroyWindow,
};