import path from 'path';
import fse from 'fs-extra';

import { ConfigHelper } from '@/configHelper';
import { NativeComponentEntry } from './ttComponentEntry';

// 小程序语法自定义组件入口
export class TtPageEntry extends NativeComponentEntry {
  /**
   *
   * @param configHelper 配置文件
   * @param entryPath pages/xx的形式
   */
  constructor(configHelper: ConfigHelper, entryPath: string) {
    super(configHelper, entryPath);
  }

  static isNative(jsPath: string) {
    if (!jsPath) {
      return false;
    }
    const ext = path.extname(jsPath);
    if (!ext) {
      jsPath = path.join(jsPath, '/index.js');
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
      return '';
    }
    return outputPath;
  }

  get virtualSource() {
    return ``;
  }
}
