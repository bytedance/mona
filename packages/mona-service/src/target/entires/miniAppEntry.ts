import path from 'path';
import fse from 'fs-extra';

import ConfigHelper from '../../ConfigHelper';
import { MiniEntry } from './miniEntry';

// 小程序语法页面入口
export class MiniAppEntry extends MiniEntry {
  constructor(configHelper: ConfigHelper, entryPath: string) {
    super(configHelper, entryPath);
  }

  static isMini(jsPath: string) {
    if (!jsPath.endsWith('app.js')) {
      return false;
    }
    const ext = path.extname(jsPath);
    let jsonPath = '';

    if (ext === '.js' || ext === '.ts') {
      jsonPath = jsPath.replace(new RegExp(`${ext}$`), '.json');
    } else if (!ext) {
      jsonPath = `${jsPath}.json`;
    } else {
      return false;
    }
    return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.pages) : false;
  }

  get virtualSource() {
    return ``;
  }

  genOutputConfig() {}
}

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
