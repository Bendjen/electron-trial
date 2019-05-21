const url = require('url')
const path = require('path')
const electron = require('electron')
const { BrowserWindow, globalShortcut } = electron
const Menu = electron.Menu
const app = electron.app

let win

function isDev() {
    return process.env['NODE_ENV'] === 'development'
}

function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({ width: 800, height: 600 })

    // 创建菜单
    // const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(null)

    // 然后加载应用的 index.html。
    if (isDev()) {
        // 这里的url换成你所使用框架开发时的url
        win.loadURL('http://localhost:9555');
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../renderer/build/index.html'),
            protocol: 'file:',
            slashes: true
        }))
    }

    if (isDev()) {
        // 添加扩展
        BrowserWindow.addDevToolsExtension(
            path.join(__dirname, '../../extensions/react-devtools')
        );
    }

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
