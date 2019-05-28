const path = require("path");
const webpack = require('webpack');
const mainConfig = require('../config/webpack.main')
const rendererConfigGenerator = require('../config/webpack.renderer')
const rootDir = path.resolve(__dirname, "../");
const child_process = require('child_process')
const electron = require('electron')
const rendererConfig = rendererConfigGenerator({
    filename: "renderer",
    entry: path.resolve(rootDir, "src/renderer/index.js"),
    output: path.resolve(rootDir, "app/renderer"),
    mode: process.env.NODE_ENV
})

console.log('start compiling ...')

Promise.all([startMain(), startRenderer()]).then(() => {
    startElectron()
})

function startMain() {

    return new Promise((resolve, reject) => {

        const compiler = webpack(mainConfig);

        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
            const info = stats.toJson();
            if (stats.hasErrors()) {
                console.log('main error:')
                console.error(info.errors);
                reject()
            } else {
                console.log('main process compiled')
                resolve()
            }
        });

        compiler.hooks.compilation.tap('Main:Compilation', (compilation) => {
            console.log('fresh main compilation')
        })

    })
}

function startRenderer() {
    // return new Promise((resolve, reject) => {
    //     const compiler = webpack(rendererConfig);

    //     compiler.watch({
    //         aggregateTimeout: 300,
    //         poll: undefined
    //     }, (err, stats) => {
    //         const info = stats.toJson();
    //         if (stats.hasErrors()) {
    //             console.log('renderer error:')
    //             console.error(info.errors);
    //             reject()
    //         } else {
    //             console.log('renderer process compiled')
    //             resolve()
    //         }
    //     });

    //     compiler.hooks.compilation.tap('Renderer:Compilation', (compilation) => {
    //         console.log('fresh renderer compilation')
    //     })

    // })

    return new Promise((resolve, reject) => {
        const rendererProcess = child_process.exec('cd src/renderer && yarn start')
        rendererProcess.on('message', (message) => {
            console.log(message)
        })
        // 子进程的标准输出(控制台输出)
        rendererProcess.stdout.on('data', data => {
            console.log('renderer process stdout text:')
            console.log(data.toString())
            if(data.toString().includes('Compiled')){
                resolve()
            }
        })

        // 子进程的标准错误输出(错误输出)
        rendererProcess.stderr.on('data', data => {
            console.log('renderer process stderr text:')
            console.log(data.toString())
        })
    })
}

function startElectron() {
    const electronProcess = child_process.exec('electron .')

    // 子进程的标准输出(控制台输出)
    electronProcess.stdout.on('data', data => {
        console.log('electron process stdout text:')
        console.log(data.toString())
    })

    // 子进程的标准错误输出(错误输出)
    electronProcess.stderr.on('data', data => {
        console.log('electron process stderr text:')
        console.log(data.toString())
    })

    // 关闭electron时退出node进程
    electronProcess.on('close', () => {
        process.exit()
    })
}