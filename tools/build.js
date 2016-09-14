'use strict';
// Summary:
//  Build for production

const path = require('path');
const shell = require('shelljs');
const helpers = require('./helpers');
const webpack = require('webpack');
const config = require('../webpack.dist.config');
const logger = (...text) =>{console.log('\x1b[36m', ...text ,'\x1b[0m');};
config.warnings = true;




var params = process.argv.slice(2),
    contextRoot;

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

const lines = helpers.getLines(path.join(__dirname, '../src/index.html'));
helpers.removeLines(lines, '/_tmp/vendors.dll.js');
let indexHtml = lines.join('\n');
indexHtml = indexHtml.replace('./main.bundle.js', `./static/main.bundle.${timestamp}.js`);

if(contextRoot){

  indexHtml = indexHtml.replace('<meta id="context-root" /> ', `<meta id="context-root" value="${contextRoot}"/> `);

}
shell.ShellString(indexHtml).to(path.join(buildFolder, 'index.html'));

const start = new Date().getTime();
webpack(config, (err) => {
  if (err) console.error(err);
  else {
    shell.mv(path.join(buildFolder, './static/main.bundle.js'), path.join(buildFolder, `./static/main.bundle.${timestamp}.js`));
    const end = new Date().getTime();
    logger('Done, build time: ', end - start, 'ms');
  }
});

