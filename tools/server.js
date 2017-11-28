"use strict";
const path = require('path');
const webpack = require('webpack');
const buildDll = require('./buildDll.js').buildDll;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('../webpack.dev.config');
const PORT = require('../package.json').webpackDevServerPort;

function startDevServer(oDllInfo) {

    const srcPath = path.join(__dirname, '../src');
    const tmpPath = oDllInfo.tmpPath;
    const manifestPath = path.join(tmpPath, 'vendors-manifest.json');
    devConfig.entry = {
        main: [
            `webpack-dev-server/client?http://localhost:${PORT}`,
            'webpack/hot/only-dev-server',
            './styles/index.less',
            './index',
        ],
    };
    devConfig.plugins.push(new webpack.DllReferencePlugin({    //include dll
        context: srcPath,
        manifest: require(manifestPath),
    }));

    devConfig.plugins.push(
        new HtmlWebpackPlugin({				  // generate HTML
            fileName: 'index.html',
            template: 'index.ejs',
            inject: true,
            dllName: "/_tmp/dev/" + oDllInfo.dllFileName,
            publicContext: devConfig.output.publicPath.match(/^(\/[^/]*)\/.*/)[1]
        })
    );

    new WebpackDevServer(webpack(devConfig), {
        publicPath: devConfig.output.publicPath,
        contentBase: devConfig.devServer.contentBase,
        proxy: devConfig.devServer.proxy,
        // chunkFilename: devConfig.output.chunkFilename,
        hot: true,
        noInfo: false,
        quiet: true,
        index: `index.html`,
        https: true,
        historyApiFallback: true,
    }).listen(PORT, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`Listening at localhost:${PORT}`);
    });
}


buildDll('dev').then(oDllInfo => {
    startDevServer(oDllInfo);
}).catch(err => {
    console.error(err.message || err);
});


