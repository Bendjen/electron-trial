import { ipcMain, dialog } from 'electron'
import windowMaker from '../window'
let messageWindow;

export default {
  init: (mountedWindow) => {
    ipcMain.on('RENDERER-TO-MAIN', (sys, message) => {
      dialog.showMessageBox({
        type: 'info',
        title: '提示',
        message: message,
      })
    })

    ipcMain.on('MAIN-TO-RENDERER', (sys, message) => {
      mountedWindow.webContents.send('MAIN-TO-RENDERER', message)
    })

    ipcMain.on('RENDERER-TO-RENDERER', (sys, message) => {
      // 不知道为什么除了mainWindow外其他的向其他winodw.webContents发送信息没有相应

      // if (!messageWindow) {
      //   messageWindow = windowMaker.newWindow({ windowKey: 'default' })
      //   messageWindow.once('ready-to-show', () => {
      //     messageWindow.webContents.send('RENDERER-TO-RENDERER', message)
      //   })
      //   messageWindow.once('closed', () => {
      //     messageWindow = null
      //   })
      // } else {
      //   messageWindow.webContents.send('RENDERER-TO-RENDERER', message)
      // }
      mountedWindow.webContents.send('RENDERER-TO-RENDERER', message)
    })

  }
}