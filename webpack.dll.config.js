"use strict";
module.exports = {
    entry: {
        vendors: [
            'webpack-dev-server/client',
            'react',
            'react-dom',
            'react-router',
            'react-redux',
            'react-router-redux',
            'redux',
            'redux-logger',
            'redux-thunk',
            'antd',
            'redux-saga',
            'whatwg-fetch'
        ],
    },
    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['react-hot-loader/webpack', 'babel-loader?cacheDirectory=true']
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader'
            }, {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }, {
                test: /\.(png|jpg)$/,
                use: 'url-loader?limit=8192'
            }
        ]
    }
};
