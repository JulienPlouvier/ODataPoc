'use strict';
process.noDeprecation = true;

const webpack = require('webpack')
const config = require('./config')
const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MergeFilesPlugin = require('merge-files-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const productionMode = process.env.WEBPACK_MODE == "production"

function assetsPath(_path) {
    var assetsSubDirectory = productionMode
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

module.exports = {
    mode: process.env.WEBPACK_MODE,
    context: __dirname,
    devtool: config.build.productionSourceMap ? 'source-map' : false,
    output: {
        path: config.build.assetsRoot,
        publicPath: "/",
        filename: assetsPath('js/[name].[hash].js'),
        chunkFilename: assetsPath('js/[name].[chunkhash].js')
    },
    entry: {
        app: './src/main.tsx'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.ts(x?)?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                },
                exclude: /node_modules/
            },
            { test: /\.woff$/, loader: 'ignore-loader' },
            { test: /\.woff2$/, loader: 'ignore-loader' },
            { test: /\.eot$/, loader: 'ignore-loader' },
            { test: /\.ttf$/, loader: 'ignore-loader' },
            { test: /\.svg$/, loader: 'ignore-loader' },
            { test: /\.png$/, loader: 'ignore-loader' },
            { test: /\.gif$/, loader: 'ignore-loader' },
            { test: /\.jpe?g$/, loader: 'ignore-loader' }
        ]
    },
    devServer: {
        historyApiFallback: true,
        contentBase: config.build.assetsRoot,
        open: true,
        hot: true
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx', '.css', '.scss']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        },
        minimize: productionMode
    },
    stats: {
        warnings: false,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            workers: 1,
            useTypescriptIncrementalApi: false | true
        }),
        new ExtractTextPlugin({
            filename: assetsPath('/style/[name].[chunkhash].css')
        }),
        new MergeFilesPlugin({
            filename: assetsPath('/style/style.scss'),
            test: /\.s?css$/,
            deleteSourceFiles: false
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: productionMode,
                collapseWhitespace: productionMode,
                removeAttributeQuotes: productionMode
            },
            chunksSortMode: 'dependency'
        }),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/static',
                to: config.build.assetsSubDirectory,
                force: true,
                ignore: ['.*']
            }
        ]),
    ]
};