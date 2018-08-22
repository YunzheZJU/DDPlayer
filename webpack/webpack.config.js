/**
 * Created by Yunzhe on 2018/8/22.
 */

'use strict';
const path = require('path');
// 导入插件
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function (env = {}) {
    const isProduction = env.production;

    const plugins = [
        new MiniCssExtractPlugin({
            filename: `main${isProduction ? '.[contenthash]' : ''}.css`
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
            }
        }),
    ];

    if (isProduction) {
        plugins.push(
            new HtmlWebpackPlugin()
        );
    }

    return {
        entry: {
            main: './src/main.js'
        },
        output: {
            path: path.join(__dirname, '../dist'),
            publicPath: '/dist/',
            filename: `main${isProduction ? '.[hash]' : ''}.js`,
        },
        mode: isProduction ? 'production' : 'development',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                    loader: 'url-loader?limit=1024',
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'less-loader',
                    ]
                }
            ]
        },
        plugins: plugins,
        optimization: isProduction ? {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true
                }),
                new OptimizeCSSAssetsPlugin()
            ]
        } : undefined,
        devServer: {
            open: true,
            historyApiFallback: {
                rewrites: [
                    {
                        from: /./,
                        to: '/src/index.html',
                    }
                ]
            }
        },
        devtool: isProduction ? false : 'source-map'
    };
};