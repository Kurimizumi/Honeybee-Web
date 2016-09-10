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
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })    
    ]
}
