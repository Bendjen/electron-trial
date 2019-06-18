import { ipcMain } from 'electron'
import { autoUpdater } from "electron-updater"

export default {
  init: (mountedWindow) => {

    autoUpdater.setFeedURL('https://raw.githubusercontent.com/Bendjen/electron-trial/master/dist/');
    autoUpdater.checkForUpdatesAndNotify();

    ipcMain.on('CHECK-UPDATE', (sys, message) => {
      mountedWindow.webContents.send('CHECK-UPDATE', {
        status: 'success',
        data: {
          status: 1,
          version: 'v1.1.0',
          releaseNote: '交互体验优化'
        }
      })
    })

    let time = 0;
    ipcMain.on('CHECK-AVAILABLE', (sys, message) => {
      mountedWindow.webContents.send('CHECK-AVAILABLE', {
        status: 'success',
        data: {
          available: time == 0 ? false : true,
          downloading: time == 0 ? true : false,
          version: 'v1.1.0',
        }
      })

      if (time == 0) {
        let total = 0;
        const progressInterval = setInterval(() => {
          const progress = Math.floor(total += 10)
          mountedWindow.webContents.send('DOWNLOAD-PROGRESS', progress)
          if (total >= 100) {
            clearInterval(progressInterval)
          }
        }, 500)
      }
      time += 1

    })
  }
}

function updateHandle() {
  let message = {
      error: '检查更新出错',
      checking: '正在检查更新……',
      updateAva: '检测到新版本，正在下载……',
      updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  const os = require('os');

  // autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
      sendUpdateMessage(error)
      sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function () {
      sendUpdateMessage(message.checking)
  });

  autoUpdater.on('update-available', function (info) {
      sendUpdateMessage(info)
  });

  autoUpdater.on('update-not-available', function (info) {
      sendUpdateMessage(message.updateNotAva)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
      sendUpdateMessage(progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      sendUpdateMessage('下载成功')
      autoUpdater.quitAndInstall();
      // ipcMain.on('isUpdateNow', (e, arg) => {
      //     console.log(arguments);
      //     console.log("开始更新");
      //     //some code here to handle event
      //     autoUpdater.quitAndInstall();
      // });

      mainWindow.webContents.send('isUpdateNow')
  });

  ipcMain.on("checkForUpdate", () => {
      //执行自动更新检查
      autoUpdater.checkForUpdates();
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  console.log(text)
  mainWindow.webContents.send('message', text)
}