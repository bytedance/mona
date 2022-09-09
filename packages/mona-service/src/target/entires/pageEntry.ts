import ConfigHelper from '../../ConfigHelper';
import { PageConfig } from '@bytedance/mona';
import { readConfig } from '@bytedance/mona-shared';
import path from 'path';
import merge from 'lodash.merge';
export class PageEntry {
  readonly entry: string;
  configHelper: ConfigHelper;
  config: PageConfig = {};
  /**
   *
   * @param configHelper 配置文件
   * @param entryPath xxxx/index 入口文件。/a/b/index.js的entryPath为/a/b/index
   */
  constructor(configHelper: ConfigHelper, entryPath: string) {
    this.entry = entryPath;
    this.configHelper = configHelper;
  }

  mergeConfig(other: PageConfig) {
    return (this.config = merge(this.config, other));
  }

  genOutputConfig() {
    const page = '';
    const pageDistPath = path.join(page.toLowerCase());
    const { cwd } = this.configHelper;

    const pageConfigPath = path.join(cwd, `./src/${page}`, '..', 'page.config');
    const pageConfig = readConfig<PageConfig>(pageConfigPath);

    return {
      outputPath: `${pageDistPath}.json`,
      resource: JSON.stringify(merge(this.config, pageConfig)),
    };
  }

  createTtml() {}
}
