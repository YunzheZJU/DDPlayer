/**
 * Created by Yunzhe on 2018/10/20.
 */

'use strict';
const path = require('path');
// 导入插件
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function (env = {}) {
    const isProduction = env['production'];
    const isPublic = env['public'];
    const domain = isPublic ? 'public' : 'private';

    const plugins = [
        new webpack.DefinePlugin({
            IS_PUBLIC: isPublic,
        }),
    ];

    if (isProduction) {
        plugins.push(new CleanWebpackPlugin([`../dist/${domain}/electron.main`], {
            allowExternal: true,
        }));
    }

    return {
        entry: {
            // 相对CWD
            main: './src/electron.js',
        },
        output: {
            // __dirname是当前文件所在位置
            path: path.join(__dirname, '..', 'dist', domain, 'electron.main'),
            filename: 'main.js',
        },
        // webpack 4起设置mode之后不需要设置DefinePlugin来定义process.env.NODE_ENV
        mode: isProduction ? 'production' : 'development',
        target: 'electron-main',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: plugins,
        optimization: isProduction ? {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                }),
            ],
        } : undefined,
        devtool: isProduction ? false : 'source-map',
    };
};