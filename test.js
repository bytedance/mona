const path = require('path');
const fse  = require('fs-extra');
function isNativeComponent(jsPath) {
  if (!jsPath) {
    return;
  }
  const ext = path.extname(jsPath);
  let jsonPath = '';
  if (ext === '.js') {
    jsonPath = jsPath.replace(/\.js$/, '.json');
  } else if (!ext) {
    jsonPath = path.join(jsPath, '/index.json');
  } else {
    return;
  }
  return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.component) : false;
}

