const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const ifDevMode = process.env.NODE_ENV !== "production";
const rootDir = path.resolve(__dirname, "../");

let rendererConfig = {
  mode: process.env.NODE_ENV,
  devtool: 'inline-source-map',
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
      title: 'Bendjen',
      template: path.resolve(rootDir, "public/index.html")
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
        test: /\.js|jsx$/,
        use: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.css|scss$/,
        exclude: "/node_modules/",
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, '../src/renderer/')
    }
  },

  // webpack-dev-server 3.5.1以前的版本把target设置为electron-renderer不能自动刷新，3.5.1修复了
  target: 'electron-renderer'
}

if (process.env.NODE_ENV === 'production') {
  rendererConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../public/lib'),
        to: path.join(__dirname, '../app/lib')
      },
      {
        from: path.join(__dirname, '../public/assets'),
        to: path.join(__dirname, '../app/renderer/assets')
      },
    ])
  )
}

module.exports = rendererConfig