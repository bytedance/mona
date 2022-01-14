import path from 'path';
import fse from 'fs-extra';

import { ConfigHelper } from '@/configHelper';
import { MINI_EXT_LIST } from '@/constants';
import { genNativeComponentEntry } from './util';
import monaStore from '../store';

const defaultEntryConfig: Record<string, any> = {};
export const nativeConfigExt = '.json';

let id = 1;
// 将路径和jsx收集的prop一一对应
export const genNativeComponentId = (resourcePath: string) => {
  const entry = monaStore.nativeEntryMap.get(resourcePath);
  if (entry?.id) {
    return entry?.id;
  }
  return `native${id++}`;
};

// 小程序语法自定义组件入口
export class TtComponentEntry {
  readonly entry: string;
  readonly dirPath: string;
  readonly basename: string;

  configHelper: ConfigHelper;
  readonly id: string;
  _config?: Record<string, any>;
  _dependencies: Array<string>;

  /**
   *
   * @param configHelper 配置文件
   * @param entryPath xxxx/index 入口文件。/a/b/index.js的entryPath为/a/b/index
   */
  constructor(configHelper: ConfigHelper, entryPath: string) {
    this.entry = entryPath.replace(path.extname(entryPath), '');
    this.configHelper = configHelper;
    this.dirPath = path.dirname(entryPath);
    this.id = genNativeComponentId(entryPath);
    this.basename = path.basename(entryPath);
    this._dependencies = MINI_EXT_LIST.map(ext => `${this.entry}${ext}`);
  }

  // TODO(p1): 分析.js中  import和require的依赖
  // 依赖包括
  // 1. *.js中import & require
  // 2. *.json文件中的usingComponents
  readDependencies(handledPath: Set<string> = new Set([this.entry])) {
    const config = this.readConfig();
    const usingComponent = config.usingComponents || {};
    const res = new Set(this._dependencies);

    Object.keys(usingComponent).forEach(name => {
      const cPath = usingComponent[name];
      let vPath;
      if (path.isAbsolute(cPath)) {
        const appEntryDir = path.join(this.configHelper.cwd, './src');
        vPath = path.join(appEntryDir, cPath);
      } else {
        vPath = path.join(this.dirPath, usingComponent[name]);
      }

      if (handledPath.has(vPath)) {
        return;
      }
      handledPath.add(vPath);

      const nEntry = genNativeComponentEntry(this.configHelper, vPath);
      nEntry.readDependencies(handledPath).forEach(d => {
        res.add(d);
      });
    });
    return res;
  }

  readConfig() {
    const ext = path.extname(this.entry);

    const filename = ext ? this.entry.replace(ext, nativeConfigExt) : `${this.entry}${nativeConfigExt}`;

    try {
      return JSON.parse(fse.readFileSync(filename).toString());
    } catch (error) {}
    return defaultEntryConfig;
  }

  static isNative(jsPath: string) {
    if (!jsPath) {
      return false;
    }
    const ext = path.extname(jsPath);
    let jsonPath = '';
    if (ext === '.js') {
      jsonPath = jsPath.replace(/\.js$/, '.json');
    } else if (!ext) {
      jsonPath = path.join(jsPath, `/${path.basename(jsPath)}.json`);
    } else {
      return false;
    }
    return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.component) : false;
  }

  get virtualSource() {
    return `
    import { createMiniComponent } from '@bytedance/mona-runtime';
    export default createMiniComponent('${this.id}')
  `;
  }

  get outputDir() {
    const dirPath = path.join(this.configHelper.cwd, './src');
    let outputPath = path.relative(dirPath, this.dirPath);

    if (!this.dirPath.startsWith(dirPath)) {
      const dirname = path.basename(this.dirPath);
      const componentPath = path.join(this.configHelper.cwd, `./src/components/tt/${dirname}${this.id}`);
      outputPath = path.relative(dirPath, componentPath);
    }
    return outputPath;
  }

  createOutputConfig() {
    const outputJson = this.readConfig();
    const usingComponents = outputJson.usingComponents || {};

    Object.keys(usingComponents).forEach(name => {
      const cPath = usingComponents[name];
      if (!path.isAbsolute(cPath)) {
        const outputPath = this.outputDir;

        const vPath = path.join(this.dirPath, cPath);
        const nEntry = genNativeComponentEntry(this.configHelper, vPath);
        usingComponents[name] = path.relative(outputPath, path.join(nEntry.outputDir, `./${nEntry.basename}`));
      }
    });

    outputJson.usingComponents = usingComponents;
    return outputJson;
  }

  get entrySource() {
    try {
      return fse.readFileSync(`${this.entry}.js`).toString();
    } catch {}
    return '';
  }

  get outputResource() {
    const outputDir = this.outputDir;

    const res = MINI_EXT_LIST.map(ext => {
      if (fse.existsSync(`${this.entry}${ext}`)) {
        const outputPath = `${outputDir}/${this.basename}${ext}`;
        let resource;

        if (ext.includes('json')) {
          resource = JSON.stringify(this.createOutputConfig(), null, 2);
        } else {
          resource = fse.readFileSync(`${this.entry}${ext}`);
        }
        return {
          outputPath,
          resource,
        };
      }
      return;
    }).filter(Boolean);

    return res as {
      outputPath: string;
      resource: Buffer | string;
    }[];
  }
}
