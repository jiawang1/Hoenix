'use strict';

const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');



module.exports = {

	buildDll(env) {

		const dllConfig = require('../webpack.dll.config.js');
		const nameVersions = dllConfig.entry.vendors.map(pkgName => {
			const pkgJson = require(path.join(pkgName.split('/')[0], 'package.json'));
			return `${pkgJson.name}_${pkgJson.version}`;
		}).join('-');
		const dllHash = require('crypto')
			.createHash('md5')
			.update(nameVersions)
			.digest('hex');
		const dllName = `vendors_${dllHash}`;
		const dllFileName = `${dllName}.dll.js`;
		console.log('dll name: ', dllName);

		const srcPath = path.join(__dirname, '../src');
		const tmpPath = env === 'dist' ? path.join(srcPath, './_tmp/dist') : path.join(srcPath, './_tmp/dev');
		const manifestPath = path.join(tmpPath, 'vendors-manifest.json');

		return new Promise((resolve, reject) => {

			if (!shell.test('-e', manifestPath) // dll doesn't exist
				|| require(manifestPath).name !== dllName // dll hash has changed
			) {
				delete require.cache[manifestPath]; // force reload the new manifest
				console.log('vendors have changed, rebuilding dll...');

				dllConfig.output = {
					path: tmpPath,
					filename: dllFileName,
					library: dllName, // reference to current dll, should be the same with dll plugin name
				};

				var oEnvironment = {
					ENV: `"${env}"`
				};
				if (env === 'dist') {
					dllConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
					dllConfig.plugins.push(new webpack.optimize.DedupePlugin());
					dllConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
					dllConfig.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
					oEnvironment['process.env'] = {
						NODE_ENV: JSON.stringify('production'),
					};
				}
				dllConfig.plugins.push(new webpack.DefinePlugin(oEnvironment));
				dllConfig.plugins.push(new webpack.DllPlugin({
					path: manifestPath,
					name: dllName,
					context: srcPath,
				}));

				webpack(dllConfig, (err, stats) => {
					if (err || stats.hasErrors()) {
						console.log('dll build failed:');
						console.log((err && err.stack) || stats.hasErrors());
						reject(err || stats.hasErrors());
					}
					console.log('dll build success.');
					resolve({
						dllFileName: dllFileName,
						tmpPath: tmpPath
					});
				});
			} else {
				console.log('vendors dll is up to date, no need to rebuild.');
				resolve({
					dllFileName: dllFileName,
					tmpPath: tmpPath
				});
			}
		});
	}
};
