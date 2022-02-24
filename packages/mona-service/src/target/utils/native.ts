import path from 'path';
import fse from 'fs-extra';
import { miniExt } from '@/target/mini/constants';

export function isMiniComponent(jsPath: string = '') {
  if (path.extname(jsPath) !== miniExt.main) return false;

  const jsonPath = jsPath.replace(/\.js$/, miniExt.config);
  return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.component) : false;
}

export function isMiniPage(jsPath: string = '') {
  if (path.extname(jsPath) !== miniExt.main) return false;
  const jsonPath = jsPath.replace(/\.js$/, miniExt.config);
  const ttmlPath = jsPath.replace(/\.js$/, miniExt.templ);
  if ([ttmlPath, jsonPath, jsPath].every(fse.existsSync)) {
    return true;
  } else {
    return false;
  }
}
