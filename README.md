## 1.如何减少打包后的安装包体积

不要将node_modules打包进来
在package.json的build.files配置中指定需要打包的文件夹

## 2.electron的目录结构，有几个package.json

electron-vue实现了单package.json的目录结构，还没研究明白怎么做到的，先用双package.json结构

## 3.如何一个命令完成renderer的编译和elctron.

通过npm-run-all包进行队列或者并行任务
yarn start : 并行运行renderer进程的dev和main进程的dev（在渲染进程完成后需要用ctrl+R进行刷新）
yarn dist : 队列执行renderer进程的打包和electron-app的打包
yarn dist:dir : 同yarn dist，但是是打包免安装版

## 4.本地开发环境请求接口的代理

## 5.打包时如何混入请求接口的环境

## 6.electron-app的自动更新

## 7.chrome开发工具扩展

1.到react-devtools官网下载并install和build
2.复制 shell/chromes/build/unpacked 文件夹到 extensions下命名为react-devtools
3.在主进程ready事件中添加BrowserWindow.addDevToolsExtension(path.join(__dirname, '../../extensions/react-devtools'));

## 8.如何解压并解密打包的文件

1.npm install asar -g
2.asar extract app.asar ./unpacked

## 9.如何配置安装包手动选择安装目录

见package.json的build.nsis配置

## 10.如何配置安装和卸载图标以及应用图标

不用平台的图标对尺寸和格式的要求不同 详见https://www.electron.build/icons
安装和卸载的图标件package.json的build.nsis配置

## 11.开发者工具与页面刷新

默认开启new的状态下，可以直接通过ctrl+R和F12刷新，但是setApplicationMenu(null)后快捷键变为不支持
所以需要手动添加监听，通过win.reload()和win.webContents.toggleDevTools()来实现
需要说明的时手动监听的快捷键不支持纯普通按键，所以需要添加成ctrl+F12

## 12.开发环境搭建

方式 1. 使用electron-connect配合gulp

(1) 在主进程插入electron-connect服务
(2) 启动renderer的编译的开发模式（脚手架自带的dev-server）
(3) 启动gulp任务开启electron窗口，并建立elecron-connect服务，实现主进程代码watch触发electron的reload和restart

这种方法是在主进程中注入了electron-connect服务，然后通过glup对文件监听，再调用服务的restart和reload从而实现开发环境的搭建
所以必须用gulp watch:electron启动，而不是默认了electron命令 electron. 使用默认的命令要去掉主进程中的electron-connect相关方法

优点：1.可以直接使用react/vue的脚手架，不用搭建renderer的开发环境；
     2.使用electron-connect配合glup实现main的重载，比较

缺点：1.双package.json架构，需要分开安装main和renderer的依赖
      2.通过npm-run-all并行运行script命令，不是异步启动electron窗口，所以窗口打开后是空白的（renderer进程还没完成编译），需要过一会刷新一下，不够优雅
      3.脚手架webpack的target一般是设置为web，这会使得应用无法使用node的能力，在纯web应用electron化的时候可以使用这种方式

注意：使用 electron-connect后直接electron .命令调用主进程会报错，
相关链接：https://segmentfault.com/a/1190000006186553

方式 2. 模仿electron-vue，利用webpack nodeAPI分别编译main、renderer进程 （当前采用的）
(1) 分别封装main、renderer的webpack complier的Promise
(2) 在上面两个Promise都resolve后，启用一个子进程运行shell命令启动elctron .

优点：1.electron窗口可以在main和renderer进程编译后再启动，避免了刚启动白屏的问题
     2.利用node进行webpack的编译任务更加灵活方便根据自己的需求进行变更配置
     3.因为webpack编译任务是自己用node进行运行的，可以自己配置入口出口，所以是单package.json的架构

缺点：1.需要用node进行webapck的任务，利用webpack-hot-middleware和webpack-dev-server完成监听和热重载，配置起来相对复杂
      2.renderer不能直接使用脚手架生成，所以也要自己搭建renderer的开发环境

方式 3. 结合以上两种方式，renderer直接采用脚手架生成，用node搭建electron的开发环境和main的热重载
(1) 生成一个promise用node主进程编译main进程的代码，并监听重载
(2) 生成一个promise用node子进程执行renderer脚手架中的start命令来创建renderer的开发环境，这样就不用手动搭建，监听子进程对控制台的输出(一般脚手架都会在完成编译时有一个提示，
理想的做法应该时在脚手架源码中send一个事件，在外面用message去监听)，来判断resolve的时机，
    这里是判断Complited文字来判断是否renderer完成的编译（在renderer的命令源码里关掉自动打开浏览器窗口，如果有的话）
(3) 在上面两个Promise都resolve后，启用一个子进程运行shell命令启动elctron .

优点：1.electron窗口可以在main和renderer进程编译后再启动，避免了刚启动白屏的问题
     2.不用手动搭建renderer的开发环境，充分利用用各主流cli自带的开发环境
     3.renderer本身也是一个独立干净的项目，可以独立发布在非electron的环境中（如果有使用main进程的能力需要手动剔除）
      4.脚手架webpack的target一般是设置为web，这会使得应用无法使用node的能力，在纯web应用electron化的时候可以使用这种方式

缺点：1.双package.json架构，需要分开安装main和renderer的依赖（不过这样也有优点，代码更独立）
      2.主进程退出后，运行renderer的子进程仍在运行

## 13.如何用node执行shell命令
node自带的child_process可以用exec或spawn方法运行shell命令

## 14.node如何关闭子进程
主线程的kill方法并不是真的使子进程退出，而是会触发子进程的SIGHUP事件，真正的退出还是依靠process.exit()

## 15.elctron窗口白屏，报错require is not defined
这是由于electron的renderer进程没有开启node环境，之前版本的electron的渲染进程默认node环境是开启的，而当前用的版本出于安全考虑（5.0）默认是关闭的
当webpack对renderer的代码进行编译时target设置为了'electron-renderer'，而在窗口中由于没有开启node环境就会报require is not defined（require是node的方法）
还有一种解决方法是把webpack的target还原成默认值'web'，这样降级处理就会无法使用node的能力，如果不需要的话可以这么处理