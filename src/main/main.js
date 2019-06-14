import { BrowserWindow, globalShortcut, Menu, app, ipcMain } from 'electron'
import { autoUpdater } from "electron-updater"
const url = require('url')
const path = require('path')

// const client = require('electron-connect').client;

let packageJson = require("../../package.json");
global.version = packageJson.version;
let win

function isDev() {
    return process.env['NODE_ENV'] === 'development'
}

console.log(`NODE_ENV=${process.env['NODE_ENV']}`)


function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        width: 1200,
        height: 900,
        // 坑点: electron5.0 以后修改了nodeIntegration的默认值，使得不开启此项elctron renderer不具备node的环境只有web的环境
        //       这就导致了renderer在使用webpack编译的时候如果target设置为'electron-renderer'，就会报错require is not defined
        webPreferences: {
            webSecurity: true,
            nodeIntegration: true
        }
    })

    // 创建菜单
    // const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(null)

    // 然后加载应用的 index.html。
    if (isDev()) {
        // 这里的url换成你所使用框架开发时的url
        win.loadURL('http://localhost:9555');
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../../app/renderer/index.html'),
            // pathname: path.join(__dirname, '../../app/renderer/index.html'),
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
        win.reload()
    })

    // 切换开发者工具
    globalShortcut.register('Ctrl+F12', () => {
        win.webContents.toggleDevTools()
    })



    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })

    // client.create(win);
    // setInterval(() => {
    //     win.webContents.send('message', 'hello world')

    // }, 1000)
    updateHandle()
    autoUpdater.setFeedURL('https://raw.githubusercontent.com/Bendjen/electron-trial/master/dist/');
    autoUpdater.checkForUpdatesAndNotify();


    // 通信

    ipcMain.on('CHECK-UPDATE', (sys, message) => {
        win.webContents.send('CHECK-UPDATE', {
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
        win.webContents.send('CHECK-AVAILABLE', {
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
                win.webContents.send('DOWNLOAD-PROGRESS', progress)
                if (total >= 100) {
                    clearInterval(progressInterval)
                }
            }, 500)
        }
        time += 1

    })



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
    if (win === null) {
        createWindow()
    }
})



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
    win.webContents.send('message', text)
}