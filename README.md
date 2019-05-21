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
