import { ipcMain } from 'electron'
import windowMaker from '../window'

export default {
  init: (mountedWindow) => {
    global.mockValue = 'hello world'
    ipcMain.on('CHANGE-GLOBAL-VALUE', (sys, data) => {
      global[data.key] = data.value
      mountedWindow.webContents.send('GLOBAL-VALUE-CHANGE', global.mockValue)
    })
    ipcMain.on('OPEN-STORAGE-WINDOW', (sys, data) => {
      const storageWindow = windowMaker.newWindow({ windowKey: 'storage' })
    })
  }
}