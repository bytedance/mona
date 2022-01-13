import path from 'path';
import fse from 'fs-extra';

import { ConfigHelper } from '@/configHelper';
import { ttEntry } from './ttEntry';

// 小程序语法自定义组件入口
export class NativeComponentEntry extends ttEntry {
  /**
   *
   * @param configHelper 配置文件
   * @param entryPath xxxx/index 入口文件
   */
  constructor(configHelper: ConfigHelper, entryPath: string) {
    super(configHelper, entryPath);
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
      jsonPath = path.join(jsPath, '/index.json');
    } else {
      return false;
    }
    return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.component) : false;
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

  get virtualSource() {
    return `
    import { createNativeComponent } from '@bytedance/mona-runtime';
    export default createNativeComponent('${this.id}')
  `;
  }
}
