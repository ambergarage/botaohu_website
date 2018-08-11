const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        port: 8080,
        https: true,
        publicPath: baseConfig.publicPath,
        watchContentBase: true
    },
    optimization: {
        minimizer: []
    }
});
