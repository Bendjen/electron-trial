const { ipcRenderer } = require('electron');

const timeoutReject = (reject, timeThreshold = 10000) => {
  setTimeout(() => {
    reject('Error:Time Out')
  }, timeThreshold)
}

export function CheckUpdate() {
  ipcRenderer.send('CHECK-UPDATE');
  return new Promise((resolve, reject) => {
    timeoutReject(reject)
    ipcRenderer.once('UPDATE-ERROR', (event, error) => {
      console.log(error)
      reject('检查更新出错')
    })
    ipcRenderer.once('UPDATE-AVAILABLE', (event, info) => {
      resolve({
        avaliable: true,
        info: info
      })
    })
    ipcRenderer.once('UPDATE-NOT-AVAILABLE', (event, info) => {
      resolve({
        avaliable: false,
        info: info
      })
    })
  })
}

export function EmitDownload() {
  ipcRenderer.send('EMIT-DOWNLOAD');
  return new Promise((resolve, reject) => {
    ipcRenderer.once('UPDATE-DOWNLOADED', (event, info) => {
      resolve(info)
    })
    ipcRenderer.once('UPDATE-ERROR', (event, error) => {
      console.log(error)
      reject('下载过程中出错')
    })
  })
}

export function EmitInstall() {
  ipcRenderer.send('EMIT-INSTALL');
}