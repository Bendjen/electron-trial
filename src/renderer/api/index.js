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
    ipcRenderer.on('CHECK-UPDATE', (event, message) => {
      if (message.status == 'success') {
        resolve(message.data)
      } else {
        reject(message.msg)
      }
    })
  })
}

export function CheckAvailable() {
  ipcRenderer.send('CHECK-AVAILABLE');
  return new Promise((resolve, reject) => {
    timeoutReject(reject)
    ipcRenderer.on('CHECK-AVAILABLE', (event, message) => {
      if (message.status == 'success') {
        resolve(message.data)
      } else {
        reject(message.msg)
      }
    })
  })
}