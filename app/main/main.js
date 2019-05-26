module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main/main.js":
/*!**************************!*\
  !*** ./src/main/main.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__dirname) {const url = __webpack_require__(/*! url */ \"url\");\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst electron = __webpack_require__(/*! electron */ \"electron\");\n\nconst {\n  BrowserWindow,\n  globalShortcut\n} = electron;\nconst Menu = electron.Menu;\nconst app = electron.app; // const client = require('electron-connect').client;\n\nlet win;\n\nfunction isDev() {\n  return \"development\" === 'development';\n}\n\nconsole.log('NODE_ENV');\nconsole.log(\"development\");\n\nfunction createWindow() {\n  // 创建浏览器窗口\n  win = new BrowserWindow({\n    width: 800,\n    height: 600\n  }); // 创建菜单\n  // const menu = Menu.buildFromTemplate(template)\n\n  Menu.setApplicationMenu(null); // 然后加载应用的 index.html。\n\n  if (isDev()) {\n    // 这里的url换成你所使用框架开发时的url\n    win.loadURL('http://localhost:9555');\n  } else {\n    win.loadURL(url.format({\n      pathname: path.join(__dirname, '../renderer/build/index.html'),\n      protocol: 'file:',\n      slashes: true\n    }));\n  }\n\n  if (isDev()) {\n    // 添加扩展\n    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../../extensions/react-devtools'));\n  } // 监听快捷键\n  // 刷新\n\n\n  globalShortcut.register('Ctrl+R', () => {\n    win.reload();\n  }); // 切换开发者工具\n\n  globalShortcut.register('Ctrl+F12', () => {\n    win.webContents.toggleDevTools();\n  }); // 当 window 被关闭，这个事件会被触发。\n\n  win.on('closed', () => {\n    // 取消引用 window 对象，如果你的应用支持多窗口的话，\n    // 通常会把多个 window 对象存放在一个数组里面，\n    // 与此同时，你应该删除相应的元素。\n    win = null;\n  }); // client.create(win);\n} // Electron 会在初始化后并准备\n// 创建浏览器窗口时，调用这个函数。\n// 部分 API 在 ready 事件触发后才能使用。\n\n\napp.on('ready', createWindow); // 退出前注销快捷键\n\napp.on('will-quit', () => {\n  // 注销所有快捷键\n  globalShortcut.unregisterAll();\n}); // 当全部窗口关闭时退出。\n\napp.on('window-all-closed', () => {\n  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，\n  // 否则绝大部分应用及其菜单栏会保持激活。\n  if (process.platform !== 'darwin') {\n    app.quit();\n  }\n});\napp.on('activate', () => {\n  // 在macOS上，当单击dock图标并且没有其他窗口打开时，\n  // 通常在应用程序中重新创建一个窗口。\n  if (win === null) {\n    createWindow();\n  }\n});\n/* WEBPACK VAR INJECTION */}.call(this, \"src\\\\main\"))\n\n//# sourceURL=webpack:///./src/main/main.js?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");\n\n//# sourceURL=webpack:///external_%22url%22?");

/***/ })

/******/ });