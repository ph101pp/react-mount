var path = require('path'),
    webpack = require('webpack');

var config = {
    debug: true,
    displayErrorDetails: true,
    outputPathinfo: true,
    entry: './index.js',
    output: {
        filename: './bundle.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};

module.exports = config;
