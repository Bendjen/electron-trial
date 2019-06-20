import { BrowserWindow, ipcMain } from 'electron'
const url = require('url')
const path = require('path')
let demoWindow;

export default {
  init: () => {
    ipcMain.on('NEW-WINDOW', (sys, config) => {
      demoWindow = newWindow(config)
    })

    ipcMain.on('CLOSE-WINDOW', (sys, key) => {
      demoWindow.close()
    })
  },
  newWindow: newWindow
}


function newWindow(config = {}) {
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
  // demoWindow.webContents.toggleDevTools()
  return demoWindow
}
