# 1.如何减少打包后的安装包体积

# 2.electron的目录结构，有几个package.json

# 3.如何一个命令完成renderer的编译和elctron.

# 4.本地开发环境请求接口的代理

# 5.打包时如何混入请求接口的环境

# 6.electron-app的自动更新

# 7.chrome开发工具扩展

1.到react-devtools官网下载并install和build
2.复制 shell/chromes/build/unpacked 文件夹到 extensions下命名为react-devtools
3.在主进程ready事件中添加BrowserWindow.addDevToolsExtension(path.join(__dirname, '../../extensions/react-devtools'));

# 8.如何解压并解密打包的文件

1.npm install asar -g
2.asar extract app.asar ./unpacked

# 9.如何减小打包的体积

不要将node_modules打包进来
在package.json的build.files配置中指定需要打包的文件夹

# 10.如何配置安装包手动选择安装目录

见package.json的build.nsis配置
