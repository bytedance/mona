import path from 'path';
import fse from 'fs-extra';

import ConfigHelper from '../../ConfigHelper';
import { MiniEntry } from './miniEntry';
import monaStore from '../store';
const { nativeEntryMap } = monaStore;
// 小程序语法页面入口
export class MiniAppEntry extends MiniEntry {
  constructor(configHelper: ConfigHelper, entryPath: string) {
    super(configHelper, entryPath);
  }

  static isMini(jsPath: string) {
    if (!(jsPath.endsWith('app.js') || jsPath.endsWith('app.ts'))) {
      return false;
    }
    const ext = path.extname(jsPath);
    let jsonPath = '';

    if (ext) {
      jsonPath = jsPath.replace(new RegExp(`${ext}$`), '.json');
    } else {
      jsonPath = `${jsPath}.json`;
    }
    return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.pages) : false;
  }

  get virtualSource() {
    return ``;
  }
}

export const genMiniAppEntry = (configHelper: ConfigHelper, entryPath: string) => {
  entryPath = entryPath.replace(path.extname(entryPath), '');

  if (nativeEntryMap.has(entryPath)) {
    return nativeEntryMap.get(entryPath)! as MiniAppEntry;
  } else {
    const nEntry = new MiniAppEntry(configHelper, entryPath);
    nativeEntryMap.set(entryPath, nEntry);
    return nEntry;
  }
};

// export const genMiniPageEntry = (configHelper: ConfigHelper, entryPath: string) => {
//   entryPath = entryPath.replace(path.extname(entryPath), '');

//   if (nativeEntryMap.has(entryPath)) {
//     return nativeEntryMap.get(entryPath)! as MiniPageEntry;
//   } else {
//     const nEntry = new MiniPageEntry(configHelper, entryPath);
//     nativeEntryMap.set(entryPath, nEntry);
//     return nEntry;
//   }
// };
