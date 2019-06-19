'use strict'

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BabiliWebpackPlugin = require('babili-webpack-plugin')

let mainConfig = {
    entry: {
        main: path.join(__dirname, '../src/main/main.js')
    },
    mode: process.env.NODE_ENV,    // 这里的mode如果不声明会用默认的development覆盖其他地方的声明
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

if (process.env.NODE_ENV === 'production') {
    mainConfig.plugins.push(
        new BabiliWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../src/main/modules/window'),
                to: path.join(__dirname, '../app/main')
            }
        ]),
    )
}

module.exports = mainConfig
