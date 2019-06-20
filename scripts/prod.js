const webpack = require('webpack');
const chalk = require('chalk')
const mainWebpackConfig = require('../config/webpack.main')
const rendererWebpackConfig = require('../config/webpack.renderer')

console.log(chalk.magenta.bold('START COMPLITING ...'))

Promise.all([distMain(), distRenderer()]).then(() => {
    console.log(chalk.magenta.bold('FINISH COMPLITE'))
    console.log(chalk.magenta.bold('START PACKING ...'))
    process.exit()
})

function distMain() {

    return new Promise((resolve, reject) => {

        const compiler = webpack(mainWebpackConfig);

        compiler.run((err, stats) => {
            const info = stats.toJson();
            if (stats.hasErrors()) {
                console.log(chalk.yellow.bold('Main Porcess Error:') + info.errors)
                reject()
            } else {
                console.log(chalk.yellow.bold('MAIN PROCESS COMPLITED'))
                resolve()
            }
        });

    })
}

function distRenderer() {
    return new Promise((resolve, reject) => {
        const compiler = webpack(rendererWebpackConfig);
        compiler.run((err, stats) => {
            const info = stats.toJson();
            if (stats.hasErrors()) {
                console.log(chalk.blue.bold('RENDERER Process Error:') + info.errors)
                reject()
            } else {
                console.log(chalk.blue.bold('RENDERER PROCESS COMPLITED'))
                resolve()
            }
        });

    })

}

