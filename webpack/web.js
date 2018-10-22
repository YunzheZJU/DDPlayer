/**
 * Created by Yunzhe on 2018/8/22.
 */

'use strict';
const path = require('path');
// 导入插件
const webpack = require('webpack');
const {GenerateSW} = require('workbox-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function (env = {}) {
    const isProduction = env['production'];

    const plugins = [
        new MiniCssExtractPlugin({
            // 为了不被serviceWorker影响，hash必须加上
            filename: 'main.[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].css',
        }),
        new VueLoaderPlugin(),
        // 必须在GenerateSW之前生成
        new HtmlWebpackPlugin({
            title: 'DDMusic',
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('0.9.1'),
            IS_ELECTRON: false,
        }),
        new GenerateSW({
            importWorkboxFrom: 'local',
            skipWaiting: true,
            clientsClaim: true,
            exclude: [/\.(?:png|jpg|jpeg|svg|html)$/],
            cacheId: 'DDMusic',
            runtimeCaching: [
                {
                    urlPattern: /.+(?:png|gif|jpg|jpeg|svg)$/,
                    handler: 'cacheFirst',
                    options: {
                        cacheName: 'DDMusic-images',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 30 * 24 * 60 * 60,
                        },
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
                // 状态码206的响应（部分数据）并不能被放入缓存...致使歌曲并不能被缓存
                // https://github.com/GoogleChrome/workbox/issues/1644
                // {
                //     urlPattern: /.+(?:mp3|m4a)$/,
                //     handler: 'cacheFirst',
                //     options: {
                //         cacheName: 'DDMusic-music',
                //         expiration: {
                //             maxEntries: 10,
                //             maxAgeSeconds: 30 * 24 * 60 * 60,
                //         },
                //         // cacheableResponse: {
                //         //     statuses: [0, 200, 206],
                //         // },
                //     },
                // },
                // 其实用不上
                {
                    urlPattern: /\.(?:js|css)$/,
                    handler: 'staleWhileRevalidate',
                    options: {
                        cacheName: 'DDMusic-static-resources',
                    },
                },
            ],
        }),
    ];

    if (isProduction) {
        plugins.push(new CleanWebpackPlugin(['../dist/web'], {
            exclude: ['favicon.ico'],
            allowExternal: true,
        }));
    }

    return {
        entry: {
            // 相对CWD
            main: './src/main.js',
        },
        output: {
            // __dirname是当前文件所在位置
            path: path.join(__dirname, '..', 'dist', 'web'),
            publicPath: '/',
            // 为了不被serviceWorker影响，hash必须加上
            filename: 'main.[hash:8].js',
            chunkFilename: '[name].[hash:8].js',
        },
        // webpack 4起设置mode之后不需要设置DefinePlugin来定义process.env.NODE_ENV
        mode: isProduction ? 'production' : 'development',
        target: 'web',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                    loader: 'url-loader?limit=1024',
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: plugins,
        optimization: isProduction ? {
            splitChunks: {
                // include all types of chunks
                chunks: 'all',
            },
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                }),
                new OptimizeCSSAssetsPlugin(),
            ],
        } : undefined,
        devServer: {
            open: true,
            contentBase: path.join(__dirname, '../dist/web'),
            historyApiFallback: {
                rewrites: [
                    {
                        from: /./,
                        to: '/index.html',
                    },
                ],
            },
        },
        devtool: isProduction ? false : 'source-map',
    };
};