import ConfigHelper from '../../ConfigHelper';
import { PageConfig } from '@bytedance/mona';
import { readConfig } from '@bytedance/mona-shared';
import path from 'path';
import monaStore from '../store';
export class PageEntry {
  readonly entry: string;
  configHelper: ConfigHelper;
  importUsingComponents: Record<string, string>;
  /**
   *
   * @param configHelper 配置文件
   * @param entryPath xxxx/index 入口文件。/a/b/index.js的entryPath为/a/b/index
   */
  constructor(configHelper: ConfigHelper, entryPath: string) {
    this.entry = entryPath.replace(path.extname(entryPath), '');
    this.configHelper = configHelper;
    this.importUsingComponents = {};
  }

  createOutputConfig() {
    const page = '';
    const pageDistPath = path.join(page.toLowerCase());
    const { cwd } = this.configHelper;

    if (monaStore.nativeEntryMap.get(path.join(cwd, './src', page))) {
      return;
    }

    const pageConfigPath = path.join(cwd, `./src/${page}`, '..', 'page.config');
    const pageConfig = readConfig<PageConfig>(pageConfigPath);

    const usingComponents = monaStore.pageEntires.get(page)?.usingComponents;
    pageConfig.usingComponents = {
      ...usingComponents,
      ...(pageConfig.usingComponents || {}),
    };

    return {
      outputPath: `${pageDistPath}.json`,
      resource: JSON.stringify(pageConfig),
    };
  }

  createTtml() {}
}
