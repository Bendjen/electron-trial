const webpack = require('webpack');
const config = require('../config/webpack.main')
const electron = require('electron')

const compiler = webpack(config);
console.log(process.env.NODE_ENV)

compiler.run((err, stats) => {
    const info = stats.toJson();
    if (stats.hasErrors()) {
        console.log('error text:')
        console.error(info.errors);
    }
});

compiler.hooks.compilation.tap('compilation', (compilation) => {
    console.log(7777)
})

// const watching = compiler.watch({
//     // watchOptions 示例
//     aggregateTimeout: 300,
//     poll: undefined
// }, (err, stats) => {
//     const info = stats.toJson();
//     if (stats.hasErrors()) {
//         console.log('error text:')
//         console.error(info.errors);
//     }
//     electron
// });