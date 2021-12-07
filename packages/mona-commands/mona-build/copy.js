const fse = require('fs-extra');
const path = require('path');

fse.copySync(path.join(__dirname, './src/ejs'), path.join(__dirname, './dist/ejs'));
