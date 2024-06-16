const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ejsFiles = fs
    .readdirSync(path.resolve(__dirname, 'src/views'))
    .filter((file) => file.endsWith('.ejs'))

const htmlPlugins = ejsFiles.map(
    (file) =>
        new HtmlWebpackPlugin({
            filename: file.replace('.ejs', '.html'),
            template: path.resolve(__dirname, 'src/views', file),
        })
)

module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dev-build'),
        filename: 'app.bundle.js',
    },
    node: {
        __dirname: true,
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /.m?js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.ejs$/i,
                use: ['html-loader', 'template-ejs-loader'],
            },
        ],
    },
    plugins: [...htmlPlugins],
}
