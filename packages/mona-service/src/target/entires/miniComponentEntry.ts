import path from 'path';
import fse from 'fs-extra';
import ConfigHelper from '../../ConfigHelper';
import { NPM_DIR } from '../constants';
import monaStore from '../store';
import { NODE_MODULES } from '@/target/constants';
import getMiniComponentDefaultValue from './util/getDefaultProps';
import { MiniEntry } from './miniEntry';

export const genMiniComponentEntry = (
  configHelper: ConfigHelper,
  entryPath: string,
  nativeEntry?: MiniComponentEntry,
) => {
  entryPath = entryPath.replace(path.extname(entryPath), '');
  if (monaStore.nativeEntryMap.has(entryPath)) {
    return monaStore.nativeEntryMap.get(entryPath)! as MiniComponentEntry;
  } else {
    const nEntry = nativeEntry || new MiniComponentEntry(configHelper, entryPath);
    monaStore.nativeEntryMap.set(entryPath, nEntry);
    return nEntry;
  }
};

interface ComponentImportInfo {
  // 包名称，例如: @bytedance/mona-runtime
  // 引入名称例如 import CustomComponent from 'xxx'。 在JSX中这样使用<CustomComponent /> ，则jsx中使用的名称 CustomComponent为componentName
  componentName: string;

  // jsx中使用的prop, native组件的jsx上不能 写spread attribute {...props} 的形式
  props: Set<string>;

  defaultProps: Record<string, any>;
  isRenderAllProps: boolean;
  // 是否使用该组件
  isUse: boolean;
}
// 小程序语法自定义组件入口
export class MiniComponentEntry extends MiniEntry {
  // 用于生成模板
  templateInfo: ComponentImportInfo;

  // TODO: 缓存方式优化，memoize
  cache: {
    usingComponents?: Set<string>;
    defaultProps?: any;
  };

  constructor(configHelper: ConfigHelper, entryPath: string) {
    super(configHelper, entryPath);
    this.templateInfo = {
      props: new Set([]),
      defaultProps: {},
      isUse: false,
      isRenderAllProps: false,
      componentName: '',
    };
    this.cache = {};
  }

  readDefaultProps(content?: string) {
    content = content || fse.readFileSync(this.path.main, 'utf8').toString();
    if (this.cache.defaultProps) {
      this.templateInfo.defaultProps = this.cache.defaultProps;
      return this.templateInfo.defaultProps;
    }

    this.templateInfo.defaultProps = getMiniComponentDefaultValue(content);

    if (this.isCache) {
      this.cache.defaultProps = this.templateInfo.defaultProps;
    }
    return this.templateInfo.defaultProps;
  }

  get isCache() {
    return this.entry.includes(NODE_MODULES);
  }

  get outputDir() {
    const dirPath = path.join(this.configHelper.cwd, './src');
    let outputPath = path.relative(dirPath, this.dirPath);

    if (this.dirPath.includes(NODE_MODULES)) {
      outputPath = this.dirPath.slice(this.dirPath.indexOf(NODE_MODULES) + NODE_MODULES.length);
      outputPath = path.join(NPM_DIR, outputPath);
    } else if (!this.dirPath.startsWith(dirPath)) {
      const dirname = path.basename(this.dirPath);
      const componentPath = path.join(this.configHelper.cwd, `./src/components/tt/${dirname}_${this.id}`);
      outputPath = path.relative(dirPath, componentPath);
    }
    return outputPath;
  }
  // 依赖包括
  readUsingComponents(handledPath: Set<string> = new Set([this.entry])) {
    const isReadEntry = handledPath.size === 1 && handledPath.has(this.entry);
    if (!fse.existsSync(`${this.entry}.js`)) {
      return new Set([]);
    } else if (this.cache.usingComponents && isReadEntry) {
      return this.cache.usingComponents;
    }

    const config = this.readConfig();
    const usingComponent = config.usingComponents || {};
    const res = new Set(this._dependencies);
    Object.keys(usingComponent).forEach(name => {
      const cPath = usingComponent[name] as string;
      let vPath;
      // usingComponent中填写绝对路径会根据资源目录读
      if (path.isAbsolute(cPath)) {
        const appEntryDir = path.join(this.configHelper.cwd, './src');
        vPath = path.join(appEntryDir, cPath);
      } else if (cPath.startsWith('../') || cPath.startsWith('./')) {
        vPath = path.join(this.dirPath, usingComponent[name]);
      } else {
        // npm包忽略
        return;
      }

      if (handledPath.has(vPath)) {
        return;
      }
      handledPath.add(vPath);

      const nEntry = genMiniComponentEntry(this.configHelper, vPath);
      nEntry?.readUsingComponents(handledPath)?.forEach(d => {
        res.add(d);
      });
    });
    if (this.isCache && isReadEntry) {
      this.cache.usingComponents = res;
    }
    return res;
  }

  static isMini(jsPath: string) {
    if (!jsPath) {
      return false;
    }
    const ext = path.extname(jsPath);
    let jsonPath = '';
    if (ext === '.js') {
      jsonPath = jsPath.replace(/\.js$/, '.json');
    } else if (!ext) {
      jsonPath = `${jsPath}.json`;
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

  genOutputConfig() {
    const outputJson = this.readConfig();
    const usingComponents = outputJson.usingComponents || {};
    const outputPath = this.outputDir;
    Object.keys(usingComponents).forEach(name => {
      const cPath = usingComponents[name];
      if (!cPath.startsWith('ext://') && !path.isAbsolute(cPath)) {
        const vPath = path.join(this.dirPath, cPath);
        const nEntry = genMiniComponentEntry(this.configHelper, vPath);
        if (nEntry) {
          usingComponents[name] = path.relative(outputPath, nEntry.outputPath.main);
        }
      }
    });
    outputJson.usingComponents = usingComponents;
    return outputJson;
  }
}
