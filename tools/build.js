'use strict';

const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const config = require('../webpack.dist.config');
const buildDll = require('./buildDll.js').buildDll;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const defaultContext = '/fivestaradminstorefront';
const logger = (...text) => { console.log('\x1b[36m', ...text, '\x1b[0m'); };
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//config.warnings = true;

var params = process.argv.slice(2),
    showAnalyze = params.indexOf('--analyze') >= 0,
    contextRoot = params.indexOf('--contextRoot') >= 0 ? params[params.indexOf('--contextRoot') + 1]: defaultContext;

// Clean folder
logger('start to build front end resources');
const buildFolder = path.join(__dirname, '../build');
shell.rm('-rf', buildFolder);
shell.mkdir(buildFolder);
shell.mkdir(`${buildFolder}/static`);

const timestamp = require('crypto')
    .createHash('md5')
    .update(new Date().getTime().toString())
    .digest('hex')
    .substring(0, 10);


buildDll('dist').then(oDllInfo => {

    const srcPath = path.join(__dirname, '../src');
    const tmpPath = oDllInfo.tmpPath;
    const manifestPath = path.join(tmpPath, 'vendors-manifest.json');
    config.output = {
        path: path.join(__dirname, '../build/static'),
        filename: `[name].bundle.${timestamp}.js`,
        publicPath: `${contextRoot}/_admin/static/`,
        chunkFilename: '[name].[chunkhash:8].chunk.js'
    };

    showAnalyze && config.plugins.push(new BundleAnalyzerPlugin());
    config.plugins.push(
        new webpack.DllReferencePlugin({    //include dll
            context: srcPath,
            manifest: require(manifestPath),
        }));

    config.plugins.push(
        new HtmlWebpackPlugin({				  // generate HTML
            fileName: `index.html`,
            template: 'index.ejs',
            inject: true,
            dllName: config.output.publicPath + oDllInfo.dllFileName,
            publicContext: defaultContext
        })
    );


    const start = new Date().getTime();
    logger(`start to build main resources at ${start}`);
    console.log(config);
    webpack(config, (err) => {
        if (err) console.error(err);
        else {
            //	shell.mv(path.join(buildFolder, './static/main.bundle.js'), path.join(buildFolder, `./static/main.bundle.${timestamp}.js`));
            shell.cp(path.join(oDllInfo.tmpPath, './' + oDllInfo.dllFileName), path.join(buildFolder, `./static/${oDllInfo.dllFileName}`));
            shell.mv(path.join(buildFolder, './static/index.html'), path.join(buildFolder, './index.html'));
            const end = new Date().getTime();
            logger('Done, build time: ', end - start, 'ms');
        }
    });

}).catch(err => {
    logger(err.message || err);
}
);





