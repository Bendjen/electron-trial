'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const webpack = require('webpack')

// const BabiliWebpackPlugin = require('babili-webpack-plugin')

let mainConfig = {
    entry: {
        main: path.join(__dirname, '../src/main/main.js')
    },
    mode: "development",    // 这里的mode一定要声明，因为默认mode是production会覆盖之前的环境
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    // 为nodejs代码在浏览器等其他环境中运行，进行polyfill或模拟nodejs的全局变量和模块
    node: {
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../app/main')
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json', '.node']
    },
    // 这里一定要声明目标环境是electron-main，否则在主进程编译过程中就会报错
    // 默认的web目标环境中缺少electron-main下的许多node和electron全局模块
    target: 'electron-main'
};

module.exports = mainConfig
