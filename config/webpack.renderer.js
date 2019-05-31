const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ifDevMode = process.env.NODE_ENV !== "production";
const rootDir = path.resolve(__dirname, "../");

module.exports = {
  mode: process.env.NODE_ENV,
  watch: ifDevMode,
  entry: path.resolve(rootDir, "src/renderer/index.js"),
  output: {
    path: path.resolve(rootDir, "app/renderer"),
    filename: `renderer.all.js`,
    publicPath: './'    // 在HtmlWebpackPlugin开启时会影响html里的引用路径
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `renderer.all.css`,
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      nodeModules: process.env.NODE_ENV !== 'production'
        ? path.resolve(__dirname, '../node_modules')
        : false,
    })
  ],
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  module: {
    rules: [
      { test: /\.tpl|xtpl$/, use: "raw-loader" },
      { test: /\.(ttf|eot|svg|woff|woff2)$/, use: "url-loader" },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        },
        exclude: "/node_modules/"
      },
      {
        test: /\.css|scss$/,
        use: [
          ifDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
          // MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  },

  // electron的renderer环境不只是单纯的浏览器环境，因为electron的renderer里面是可以调用node的功能
  // electron5.0版本窗口的默认node能力是关闭的需要手动打开 webPreferences.nodeIntegration
  target: 'electron-renderer'
}

