'use strict';
// Summary:
//  Build for production

const path = require('path');
const shell = require('shelljs');
const helpers = require('./helpers');
const webpack = require('webpack');
const config = require('../webpack.dist.config');
const buildDll = require('./buildDll.js').buildDll;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const defaultContext = '/fivestaradminstorefront';
const logger = (...text) =>{console.log('\x1b[36m', ...text ,'\x1b[0m');};
config.warnings = true;

var params = process.argv.slice(2),
	contextRoot = defaultContext;

	if(params.length > 0 && params[0] === '--contextRoot' ){
		contextRoot =  params[1];
	}

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


	buildDll('dist').then(oDllInfo=>{

		const srcPath = path.join(__dirname, '../src');
		const tmpPath = oDllInfo.tmpPath;
		const manifestPath = path.join(tmpPath, 'vendors-manifest.json');
		
		config.output={
			path: path.join(__dirname, '../build/static'),
			filename:`[name].bundle.${timestamp}.js`,
			publicPath: `${contextRoot}/_admin/static/`
		};
		config.plugins.push(
			new webpack.DllReferencePlugin({    //include dll
				context: srcPath,
				manifest: require(manifestPath),
			}));

			config.plugins.push(					
				   new HtmlWebpackPlugin({				  // generate HTML
					   fileName: `index.html`,
					   template:'index.ejs',
					   inject: true,
					   dllName: config.output.publicPath + oDllInfo.dllFileName,
					   publicContext : defaultContext
				   })
			);

		console.log(config);


								  //		const lines = helpers.getLines(path.join(__dirname, '../src/index.html'));
								  //		helpers.removeLines(lines, '/_tmp/vendors.dll.js');
								  //		let indexHtml = lines.join('\n');
								  //		indexHtml = indexHtml.replace('./main.bundle.js', `./static/main.bundle.${timestamp}.js`);
								  //
								  //		if(contextRoot){
								  //			indexHtml = indexHtml.replace(/<meta id="context-root".*/, `<meta id="context-root" value="${contextRoot}"/>`);
//		}
//		shell.ShellString(indexHtml).to(path.join(buildFolder, 'index.html'));





const start = new Date().getTime();
webpack(config, (err) => {
	if (err) console.error(err);
	else {
		//	shell.mv(path.join(buildFolder, './static/main.bundle.js'), path.join(buildFolder, `./static/main.bundle.${timestamp}.js`));
		shell.cp(path.join(oDllInfo.tmpPath, './'+oDllInfo.dllFileName), path.join(buildFolder, `./static/${oDllInfo.dllFileName}`));
		shell.mv(path.join(buildFolder, './static/index.html'), path.join(buildFolder, './index.html'));
		const end = new Date().getTime();
		logger('Done, build time: ', end - start, 'ms');
	}
});

	}).catch(err=>{
		logger(err.message || err);
	}
			);





