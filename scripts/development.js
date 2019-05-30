const path = require("path");
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const mainWebpackConfig = require('../config/webpack.main')
const rendererWebpackConfig = require('../config/webpack.renderer')
const child_process = require('child_process')
const electron = require('electron')
const rootDir = path.resolve(__dirname, "../");

let electronProcess
let mainCompiledRestart = false
console.log('start compiling ...')

Promise.all([startMain(), startRenderer()]).then(() => {
    startElectron()
})

function startMain() {

    return new Promise((resolve, reject) => {

        const compiler = webpack(mainWebpackConfig);

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
                if (electronProcess) {
                    process.kill(electronProcess.pid)
                    mainCompiledRestart = true
                    electronProcess = null
                    startElectron()
                    setTimeout(() => {
                        mainCompiledRestart = false
                    }, 1000);
                }
                resolve()
            }
        });

    })
}

function startRenderer() {
    return new Promise((resolve, reject) => {
        const compiler = webpack(rendererWebpackConfig);
        const server = new webpackDevServer(compiler, {
            // 启动服务后 localhost对应的目录，取该目录下的index.html作为localhost根目录对应的返回
            // 注意：如果webpack配置中使用了HtmlWebpackPlugin插件,生成的html替代此目录下的html(如果有的话)返回
            contentBase: path.resolve(rootDir, 'public'),
            // dev-server编译的静态文件不会生成在硬盘中而是在缓存中，默认是localhost的根目录
            // 如果想要控制编译后的静态文件的输出的访问路径，需要手动配置
            // 注意：如果webpack配置中使用了HtmlWebpackPlugin插件，html文件也是编译出来的，和所有静态文件放在一起，
            //       页面访问路径就变成了localhost:port/publicPath
            publicPath: '/',
            hot: true,
            host: 'localhost'
        })

        server.listen(9555, 'localhost', () => {
            console.log('dev server listening on port 9555');
            resolve()
        });

    })

    // 如果想直接renderer用脚手架的话，可以这样

    // return new Promise((resolve, reject) => {
    //     rendererProcess = child_process.exec('yarn start', {
    //         cwd: 'src/renderer',
    //         detached: false,
    //         stdio: 'ignore'
    //     })
    //     rendererProcess.on('message', (message) => {
    //         console.log(message)
    //     })
    //     // 子进程的标准输出(控制台输出)
    //     rendererProcess.stdout.on('data', data => {
    //         console.log('renderer process stdout text:')
    //         console.log(data.toString())
    //         if (data.toString().includes('Compiled')) {
    //             console.log('renderProcess id:' + rendererProcess.pid)
    //             resolve()
    //         }
    //     })

    //     // 子进程的标准错误输出(错误输出)
    //     rendererProcess.stderr.on('data', data => {
    //         console.log('renderer process stderr text:')
    //         console.log(data.toString())
    //     })

    //     rendererProcess.on('SIGHUP', function () {
    //         console.log('收到kill')
    //     });
    // })
}

function startElectron() {
    electronProcess = child_process.spawn(electron, ['.'], {
        detached: false
    })

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
        if (!mainCompiledRestart) {
            process.exit()
        }
    })
}