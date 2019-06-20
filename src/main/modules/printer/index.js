import { ipcMain,shell } from 'electron'
const path = require('path')
const fs = require('fs')
const os = require('os')

const pdfPath = path.join(os.tmpdir(), 'PDFprint.pdf');

export default {
  init: (mountedWindow) => {
    ipcMain.on('WINDOW-PRINT', () => {
      mountedWindow.webContents.print({
        silent: false,
        printBackground: true
      })
    })
    ipcMain.on('WINDOW-PRINT-PDF', () => {
      mountedWindow.webContents.printToPDF({
        printBackground: true
      }, (error, data) => {
        fs.writeFile(pdfPath, data, (error) => {  
          if (error) throw error
          console.log(pdfPath)
          shell.openExternal(`file://${pdfPath}`)
        });
      })
    })

  }
}