import { BrowserWindow, globalShortcut, Menu, app, crashReporter } from 'electron'

import windowMaker from "./modules/window"
import updater from "./modules/updater"
import communication from "./modules/communication"
import dataSharing from "./modules/dataSharing"
import printer from "./modules/printer"
import other from "./modules/other"

const url = require('url')
const path = require('path')

// const client = require('electron-connect').client;

let packageJson = require("../../package.json");
global.version = packageJson.version;

let mainWindow

function isDev() {
    return process.env['NODE_ENV'] === 'development'
}

console.log(`NODE_ENV=${process.env['NODE_ENV']}`)


function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        show: false,
        // 坑点: electron5.0 以后修改了nodeIntegration的默认值，使得不开启此项elctron renderer不具备node的环境只有web的环境
        //       这就导致了renderer在使用webpack编译的时候如果target设置为'electron-renderer'，就会报错require is not defined
        webPreferences: {
            webSecurity: true,
            nodeIntegration: true
        }
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // 创建菜单
    // const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(null)

    // 然后加载应用的 index.html。
    if (isDev()) {
        // 这里的url换成你所使用框架开发时的url
        mainWindow.loadURL('http://localhost:9555');
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../../app/renderer/index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }


    // 添加扩展
    BrowserWindow.addDevToolsExtension(
        path.join(__dirname, '../../extensions/react-devtools')
    );


    // 监听快捷键
    // 刷新
    globalShortcut.register('Ctrl+R', () => {
        mainWindow.reload()
    })

    // 切换开发者工具
    globalShortcut.register('Ctrl+F12', () => {
        mainWindow.webContents.toggleDevTools()
    })



    // 当 window 被关闭，这个事件会被触发。
    mainWindow.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        mainWindow = null
    })

    mainWindow.on('crashed', () => {
        crashReporter.start({
            productName: 'YourName',
            companyName: 'YourCompany',
            submitURL: 'https://your-domain.com/url-to-submit',
            uploadToServer: false
        })
    })

    updater.init(mainWindow)
    dataSharing.init(mainWindow)
    communication.init(mainWindow)
    printer.init(mainWindow)
    windowMaker.init()
    other.init(mainWindow,app)

}




// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 退出前注销快捷键
app.on('will-quit', () => {
    // 注销所有快捷键
    globalShortcut.unregisterAll()
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (mainWindow === null) {
        createWindow()
    }
})
