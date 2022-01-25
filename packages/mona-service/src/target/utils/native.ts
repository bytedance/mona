// import { getOptions } from 'loader-utils';
import path from 'path';
import fse from 'fs-extra';

export function isNativeComponent(jsPath: string) {
  if (!jsPath || path.extname(jsPath) !== '.js') return false;

  const jsonPath = jsPath.replace(/\.js$/, '.json');
  return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.component) : false;
}

export function isNativePage(jsPath: string) {
  // ts???
  if (!jsPath || path.extname(jsPath) !== '.js') return false;
  const jsonPath = jsPath.replace(/\.js$/, '.json');
  const ttmlPath = jsPath.replace(/\.js$/, '.ttml');
  if ([ttmlPath, jsonPath, jsPath].every(fse.existsSync)) {
    return true;
  } else {
    return false;
  }
}
