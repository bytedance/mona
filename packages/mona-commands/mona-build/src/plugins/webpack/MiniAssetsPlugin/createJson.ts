import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { readConfig } from '@bytedance/mona-shared';
import { AppConfig, PageConfig } from '@bytedance/mona';
import { DEFAULT_APPID } from '@/constants';
import { Compilation, Compiler, sources, NormalModule } from 'webpack';
import { ConfigHelper } from '@/configHelper';
import formatMiniPath from '@/utils/formatMiniPath';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { getHashDigest } from 'loader-utils';
import monaStore from '../../../store';
import { processNativePath } from '@/plugins/babel/CollectImportComponent';
import { getPageEntryPath, getRelativePath } from '@/utils/utils';
import { formatReactNodeName } from '@/utils/reactNode';

const RawSource = sources.RawSource;

const defaultAppConfig: AppConfig = {
  pages: [],
};

function formatIconPath(input: string, iconPath?: string) {
  if (!iconPath) {
    return iconPath;
  }

  const filePath = path.join(input, iconPath);
  if (!fs.existsSync(filePath)) {
    throw new Error("can't find iconPath " + iconPath);
  }

  // @ts-ignore
  const contentHash = getHashDigest(fs.readFileSync(filePath), 'md5', 'hex', 16);
  const ext = path.extname(filePath);

  return `${contentHash}${ext}`;
}

function formatAppConfig(rawConfig: AppConfig, input: string): AppConfig {
  let config = {
    ...defaultAppConfig,
    ...rawConfig,
  };

  // format tabBar-list-pagePath
  if (config.tabBar) {
    config = {
      ...config,
      tabBar: {
        ...config.tabBar,
        list: config.tabBar.list.map(item => ({
          ...item,
          iconPath: formatIconPath(input, item.iconPath),
          selectedIconPath: formatIconPath(input, item.selectedIconPath),
          pagePath: formatMiniPath(item.pagePath),
        })),
      },
    };
  }

  return {
    ...config,
    pages: config.pages.map(p => formatMiniPath(p)),
  };
}

export default async function createJson(compiler: Compiler, compilation: Compilation, configHelper: ConfigHelper) {
  const { appConfig, cwd, projectConfig } = configHelper;
  const pages = appConfig.pages ?? [];

  // project.config.json
  const projectFile = 'project.config.json';
  if (!compilation.getAsset(projectFile)) {
    const tplPath = path.join(__dirname, '../../../ejs', './project.config.js.ejs');
    const raw = await ejs.renderFile(tplPath, {
      appid: projectConfig.appId || DEFAULT_APPID,
      name: projectConfig.projectName,
    });
    const source = new RawSource(raw);
    compilation.emitAsset(projectFile, source);
  }

  // app.json
  const appFile = 'app.json';
  if (!compilation.getAsset(appFile)) {
    const formatedAppConfig = formatAppConfig(appConfig, cwd);
    const source = new RawSource(JSON.stringify(formatedAppConfig));
    compilation.emitAsset(appFile, source);

    const input = cwd;
    const output = path.join(cwd, projectConfig.output);
    if (appConfig.tabBar?.list) {
      const list = appConfig.tabBar?.list ?? [];
      const formatedList = formatedAppConfig.tabBar?.list ?? [];
      const copyConfig: { from: string; to: string }[] = [];
      for (let i = 0; i < appConfig.tabBar?.list.length; i++) {
        const f1 = list[i].iconPath;
        const t1 = formatedList[i].iconPath;
        const f2 = list[i].selectedIconPath;
        const t2 = formatedList[i].selectedIconPath;
        if (f1 && t1) {
          copyConfig.push({ from: path.join(input, f1), to: path.join(output, t1) });
        }
        if (f2 && t2) {
          copyConfig.push({ from: path.join(input, f2), to: path.join(output, t2) });
        }
      }

      // add copy plugin
      new CopyWebpackPlugin({ patterns: copyConfig }).apply(compiler);
    }
  }

  // page json
  pages.forEach(page => {
    const pageDistPath = path.join(page.toLowerCase());
    const file = `${pageDistPath}.json`;

    if (compilation.getAsset(file)) {
      return;
    }

    const pageConfigPath = path.join(cwd, `./src/${page}`, '..', 'page.config');
    const pageConfig = readConfig<PageConfig>(pageConfigPath);

    // TODO:
    const usingComponents = monaStore.pageEntires.get(page)?.usingComponents;
    pageConfig.usingComponents = {
      ...usingComponents,
      ...(pageConfig.usingComponents || {}),
    };

    const source = new RawSource(JSON.stringify(pageConfig));
    compilation.emitAsset(file, source);
  });
}

function processModuleFactory(cwd: string, handledModules: Set<string>) {
  function processModule(compilation: Compilation, module: NormalModule, page: string) {
    // 处理循环递归
    if (handledModules.has(module.resource)) {
      return;
    }

    module.dependencies.forEach(item => {
      // 根据dependency获取module的方式。
      // webpack4 通过dependency.module
      // webpack5 通过compilation.moduleGraph.getModule ，传入dependency，获取dependency的module
      if (module.context) {
        const dependencyModule = compilation.moduleGraph.getModule(item);
        //@ts-ignore
        const requestPath = item.request || item.userRequest;
        if (!requestPath) {
          return;
        }

        let filePath = processNativePath(requestPath, module.context, cwd);

        const componentInfo = monaStore.importComponentMap.get(filePath);
        if (componentInfo?.type === 'native') {
          let pageInfo = monaStore.pageEntires.get(page) || { usingComponents: {}, type: 'mona' };

          pageInfo.usingComponents = {
            ...(pageInfo.usingComponents || {}),
            // 计算两个页面和自定义组件两个绝对路径之间的相对路径
            [formatReactNodeName(componentInfo.componentName)]: getRelativePath(
              path.dirname(getPageEntryPath(page, cwd)),
              componentInfo.path,
            ),
          };

          monaStore.pageEntires.set(page, pageInfo);
        } else {
          processModule(compilation, dependencyModule as NormalModule, page);
        }
      }
    });
  }
  return processModule;
}

// 添加引用自定义组件的配置项
// 详见https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/custom-component/custom-component/#使用自定义组件
export function addUsingComponents(compiler: Compiler, configHelper: ConfigHelper) {
  const pagesPath = new Map();

  configHelper.appConfig.pages.forEach(page => {
    const res = getPageEntryPath(page, configHelper.cwd);
    pagesPath.set(res, page);
  });

  const handledModules: Set<string> = new Set();
  const processModule = processModuleFactory(configHelper.cwd, handledModules);

  compiler.hooks.emit.tap('PLUGIN_NAME', async compilation => {
    const modules = Array.from(compilation.modules.values()) as NormalModule[];
    modules.forEach(module => {
      let resourcePath = module.resource?.replace(path.extname(module.resource), '');
      const pagePath = pagesPath.get(resourcePath);
      if (pagePath) {
        processModule(compilation, module, pagePath);
      }
    });
  });
}
