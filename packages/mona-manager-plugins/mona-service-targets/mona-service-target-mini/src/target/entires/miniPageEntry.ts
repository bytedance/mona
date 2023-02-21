import path from 'path';
import fse from 'fs-extra';
import { miniExt } from '@/target/mini/constants';

import {ConfigHelper} from '@bytedance/mona-manager';
import { MiniComponentEntry } from './miniComponentEntry';
import monaStore from '../store';
const { nativeEntryMap } = monaStore;
// 小程序语法页面入口
export class MiniPageEntry extends MiniComponentEntry {
  constructor(configHelper: ConfigHelper, entryPath: string) {
    super(configHelper, entryPath);
  }

  static isMini(jsPath: string) {
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

    const ttmlPath = jsPath.replace(/\.js$/, miniExt.templ);

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

export const genMiniPageEntry = (configHelper: ConfigHelper, entryPath: string) => {
  entryPath = entryPath.replace(path.extname(entryPath), '');

  if (nativeEntryMap.has(entryPath)) {
    return nativeEntryMap.get(entryPath)! as MiniPageEntry;
  } else {
    const nEntry = new MiniPageEntry(configHelper, entryPath);
    nativeEntryMap.set(entryPath, nEntry);
    return nEntry;
  }
};
