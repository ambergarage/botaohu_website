const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        port: 8080,
        publicPath: baseConfig.publicPath,
        watchContentBase: true
    },
    optimization: {
        minimizer: []
    },
    plugins: [
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            optipng: null,
            jpegtran: null,
            plugins: [
                imageminMozjpeg({
                    quality: 80,
                    progressive: true
                }),
                imageminPngquant({
                    quality: [0.9, 0.95]
                })
            ]
        })
    ]
});
