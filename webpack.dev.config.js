const path = require('path');
const webpack = require('webpack');
const defaultContext = '/hoenix';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

// Webpak Dashboard
var Dashboard = require('webpack-dashboard');
var dashboard = new Dashboard();

module.exports = {
    devtool: 'inline-source-map',
    cache: true,
    /*eslint-disable*/ 
    context: path.join(__dirname, 'src'),
    entry: {
        // dynamically add by server.js
    },
    output: {
        path: path.join(__dirname, 'build/static'),
        filename: '[name].bundle.js',
        publicPath: `${defaultContext}/_admin/`,
        chunkFilename: '[name].[chunkhash:8].chunk.js',
        sourceMapFilename: "[name].map"
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        /*eslint-enable*/ 
        proxy: {
            '!(**/_admin/**|/_tmp/**|/**/_admin/|/_tmp/*/**)': {

                //target: 'http://localhost:8088',
                //target: 'https://localhost:9002',
                target: 'http://localhost:8079',
                //target:'https://172.26.132.3',
                secure: false
            }
        }
    },
    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({filename: 'styles.css'}),
        new webpack.DefinePlugin({
            ENV: '"dev"',
        }),
        new DashboardPlugin(dashboard.setData),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules|build/,
                use: ['react-hot-loader/webpack', 'babel-loader?cacheDirectory=true']
            }, {
                test: /\.(ttf|eot|woff|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader'
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({fallback:'style-loader', 
                    use: [{loader:'css-loader', options:{ sourceMap: true }},
                        {loader:'postcss-loader', options:{ 
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: loader=>[require('autoprefixer')()]
                        }},
                          {loader:'less-loader', options:{ sourceMap: true }}]
                        })
            }, {
                test: /\.(png|jpg)$/,
                use: 'url-loader?limit=8192'
            }
        ]
    }
};
