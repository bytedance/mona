import path from 'path';
import fse from 'fs-extra';

import { ConfigHelper } from '@/configHelper';
import { TtComponentEntry } from './ttComponentEntry';

// 小程序语法页面入口
export class TtPageEntry extends TtComponentEntry {
  constructor(configHelper: ConfigHelper, entryPath: string) {
    super(configHelper, entryPath);
  }

  static isNative(jsPath: string) {
    if (!jsPath) {
      return false;
    }
    const ext = path.extname(jsPath);
    if (!ext) {
      if (jsPath.endsWith('/')) {
        jsPath = path.join(jsPath, './index.js');
      } else {
        jsPath = `${jsPath}.js`;
      }
    } else if (ext !== '.js') {
      return false;
    }

    const ttmlPath = jsPath.replace(/\.js$/, '.ttml');

    if ([ttmlPath, jsPath].every(fse.existsSync)) {
      return true;
    } else {
      return false;
    }
  }

  get outputDir() {
    const dirPath = path.join(this.configHelper.cwd, './src');
    let outputPath = path.relative(dirPath, this.dirPath);

    if (!this.dirPath.startsWith(dirPath)) {
      console.warn('please check page path', outputPath);
      return '';
    }
    return outputPath;
  }

  get virtualSource() {
    return ``;
  }
}
