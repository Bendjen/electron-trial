import { ipcMain } from 'electron'
import { autoUpdater } from "electron-updater"

export default {
  init: (mountedWindow) => {

    autoUpdater.setFeedURL('https://raw.githubusercontent.com/Bendjen/electron-trial/master/release/');
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.checkForUpdates();
    // autoUpdater 对象监听

    autoUpdater.on('error', (error) => {
      console.log(error)
      mountedWindow.webContents.send('UPDATE-ERROR', error)
    });
    autoUpdater.on('checking-for-update', () => { });

    autoUpdater.on('update-available', (info) => {
      mountedWindow.webContents.send('UPDATE-AVAILABLE', info)
    });

    autoUpdater.on('update-not-available', function (info) {
      mountedWindow.webContents.send('UPDATE-NOT-AVAILABLE', info)
    });

    autoUpdater.on('download-progress', function (progressInfo) {
      mountedWindow.webContents.send('DOWNLOAD-PROGRESS', progressInfo)
    })

    autoUpdater.on('update-downloaded', function (info) {
      mainWindow.webContents.send('UPDATE-DOWNLOADED', info)
    });



    // renderer请求监听

    ipcMain.on('CHECK-UPDATE', (sys, message) => {
      autoUpdater.checkForUpdates();
    })

    let time = 0;
    ipcMain.on('EMIT-DOWNLOAD', (sys, message) => {
      autoUpdater.downloadUpdate();
    })

    ipcMain.on('EMIT-INSTALL', (sys, message) => {
      autoUpdater.quitAndInstall();
    })
  }
}