import { BrowserWindow, ipcMain } from 'electron'
const url = require('url')
const path = require('path')

export default function (config = {}) {
  const defaultConfig = {
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true
    }
  }
  const demoWindow = new BrowserWindow(Object.assign(defaultConfig, config));
  demoWindow.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, `${config.windowKey}.html`),
    slashes: true
  }));
  return demoWindow
}