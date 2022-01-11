import { ConfigHelper } from '@/configHelper';
import path from 'path';
import fse from 'fs-extra';
const defaultEntryConfig: Record<string, any> = {};
const nativeConfigExt = '.json';
export const nativeEntryMap = new Map<string, NativeComponentEntry>();

let id = 1;
// 将路径和jsx收集的prop一一对应
export const genNativeComponentId = (resourcePath: string) => {
  const entry = nativeEntryMap.get(resourcePath);
  if (entry?.id) {
    return entry?.id;
  }
  return `native${id++}`;
};

export class NativeComponentEntry {
  entry: string;
  dirname: string;
  configHelper: ConfigHelper;
  id: string;
  _config?: Record<string, any>;
  _dependencies?: string[];
  /**
   *
   * @param configHelper 配置文件
   * @param entryPath xxxx/index 入口文件
   */
  constructor(configHelper: ConfigHelper, entryPath: string) {
    this.entry = entryPath.replace(path.extname(entryPath), '');
    this.configHelper = configHelper;
    this.dirname = path.dirname(entryPath);
    this.id = genNativeComponentId(entryPath);
  }

  static isNativeComponent(jsPath: string) {
    if (!jsPath) {
      return false;
    }
    const ext = path.extname(jsPath);
    let jsonPath = '';
    if (ext === '.js') {
      jsonPath = jsPath.replace(/\.js$/, '.json');
    } else if (!ext) {
      jsonPath = path.join(jsPath, '/index.json');
    } else {
      return false;
    }
    return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.component) : false;
  }

  // 获取usingComponents
  readDependencies() {
    const config = this.config;
    const usingComponent = config.usingComponent;
    const res: string[] = [];

    // TODO: 防止自定义组件循环依赖，热更新
    Object.keys(usingComponent).forEach(name => {
      const vPath = path.join(this.dirname, usingComponent[name]);
      res.push(vPath);
      let nEntry = genNativeComponentEntry(this.configHelper, vPath);

      res.push(...nEntry.readDependencies());
    });
    this._dependencies = res;
    return res;
  }

  readConfig() {
    const ext = path.extname(this.entry);
    const filename = ext ? this.entry.replace(ext, nativeConfigExt) : path.join(this.entry, nativeConfigExt);
    let res = defaultEntryConfig;
    if (fse.existsSync(filename)) {
      try {
        res = JSON.parse(fse.readFileSync(filename).toString());
      } catch (error) {}
    }
    this._config = res;
    return res;
  }

  get config() {
    return this._config ?? (this._config = this.readConfig());
  }
  get dependencies() {
    return this._dependencies ?? (this._dependencies = this.readDependencies());
  }

  get virtualSource() {
    return `
    import { createNativeComponent } from '@bytedance/mona-runtime';
    export default createNativeComponent('${this.id}')
  `;
  }
}

export const genNativeComponentEntry = (configHelper: ConfigHelper, entryPath: string) => {
  if (nativeEntryMap.has(entryPath)) {
    return nativeEntryMap.get(entryPath)!;
  } else {
    const nEntry = new NativeComponentEntry(configHelper, entryPath);
    nativeEntryMap.set(entryPath, nEntry);
    return nEntry;
  }
};
