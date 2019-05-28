const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = ({ entry, filename, mode, output }) => {
  const devMode = mode !== "production";
  const rootDir = path.resolve(__dirname, "../");

  return {
    mode: mode,
    watch: devMode,
    entry: entry,
    output: {
      path: output,
      filename: `${filename}.all.js`
    },
    externals: {
      vue: "Vue"
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${filename}.all.css`,
        chunkFilename: "[id].css"
      })
    ],
    module: {
      rules: [
        // { test: /\.vue$/, use: "vue-loader" },
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
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            // MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        }
      ]
    }
  };
};
