import path from 'path';
import fse from 'fs-extra';
import ConfigHelper from '../../ConfigHelper';
import monaStore from '../store';
import { NODE_MODULES } from '@/target/constants';
import { miniExt } from '@/target/mini/constants';

const defaultEntryConfig: Record<string, any> = {};

let id = 1;
// 将路径和jsx收集的prop一一对应
export const genMiniComponentId = (resourcePath: string) => {
  const entry = monaStore.nativeEntryMap.get(resourcePath);
  if (entry?.id) {
    return entry?.id;
  }
  return `mini${id++}`;
};

export class MiniEntry {
  basename: string = '';
  dirPath: string = '';
  _dependencies: string[] = [];
  readonly id: string;
  configHelper: ConfigHelper;
  _entry: string = '';
  /**
   *
   * @param configHelper 配置文件
   * @param entryPath xxxx/index 入口文件。/a/b/index.js的entryPath为/a/b/index
   */
  constructor(configHelper: ConfigHelper, entryPath: string) {
    this.entry = entryPath;
    this.configHelper = configHelper;
    this.id = genMiniComponentId(entryPath);
  }

  set entry(e: string) {
    this._entry = e;
    this.basename = path.basename(e);
    this.dirPath = path.dirname(e);
    this._dependencies = Object.values(miniExt).map(ext => `${e}${ext}`);
  }

  get entry() {
    return this._entry;
  }

  get path() {
    return {
      main: `${this.entry}${miniExt.main}`,
      stylePath: `${this.entry}${miniExt.style}`,
      templatePath: `${this.entry}${miniExt.templ}`,
      configPath: `${this.entry}${miniExt.config}`,
    };
  }

  get context() {
    let context = this.dirPath;
    if (this.dirPath.includes(NODE_MODULES)) {
      context = context.slice(0, context.indexOf(NODE_MODULES) + NODE_MODULES.length + 1);
    }

    return context;
  }
  get outputDir() {
    const dirPath = path.join(this.configHelper.cwd, './src');
    let outputPath = path.relative(dirPath, this.dirPath);

    if (!this.dirPath.startsWith(dirPath)) {
      console.warn('please check app path', outputPath);
      return '';
    }
    return outputPath;
  }
  get outputPath() {
    const outputDir = this.outputDir;
    return {
      main: path.join(outputDir, `./${this.basename}`),
      mainPath: path.join(outputDir, `./${this.basename}${miniExt.main}`),
      stylePath: path.join(outputDir, `./${this.basename}${miniExt.style}`),
      templatePath: path.join(outputDir, `./${this.basename}${miniExt.templ}`),
      configPath: path.join(outputDir, `./${this.basename}${miniExt.config}`),
    };
  }

  readConfig() {
    const ext = path.extname(this.entry);

    const filename = ext ? this.entry.replace(ext, miniExt.config) : this.path.configPath;

    try {
      return JSON.parse(fse.readFileSync(filename).toString());
    } catch (error) {}
    return defaultEntryConfig;
  }

  genOutputConfig() {
    return this.readConfig();
  }
}
