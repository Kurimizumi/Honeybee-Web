const dir = __dirname
const webpack = require('webpack')

module.exports = {
    entry: "./build/main.js",
    output: {
        filename: "build/out/out.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|forge.bundle.js)/,
                loader: 'babel-loader'
            }
            ]
        
    },
    resolve: {
        alias: {
          "node-forge": `${dir}/build/out/forge.bundle.js`
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })    
    ]
}