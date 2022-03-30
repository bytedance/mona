import path from 'path';
import ejs from 'ejs';
//@ts-ignore
import ConcatenatedModule from 'webpack/lib/optimize/ConcatenatedModule';
import { readConfig } from '@bytedance/mona-shared';
import { PageConfig } from '@bytedance/mona';
import ConfigHelper from '@/ConfigHelper';
import { formatAppConfig } from '@bytedance/mona-shared';

import { Compilation, sources, NormalModule } from 'webpack';

import monaStore from '@/target/store';
import { processNativePath } from '@/utils';
import { getPageEntryPath, getRelativePath } from '@/target/utils/utils';
import { formatReactNodeName } from '@/target/utils/reactNode';
import { DEFAULT_APPID } from '@/target/constants';
import { MiniComponentEntry } from '@/target/entires/miniComponentEntry';

const RawSource = sources.RawSource;
const ejsRelativePath = '../../../assets/ejs';
export default async function createJson(compilation: Compilation, configHelper: ConfigHelper) {
  const { appConfig, cwd, projectConfig } = configHelper;
  const pages: string[] = appConfig.pages ?? [];

  // project.config.json
  const projectFile = 'project.config.json';
  if (!compilation.getAsset(projectFile)) {
    const tplPath = path.join(__dirname, ejsRelativePath, './project.config.js.ejs');
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
    const formatedAppConfig = formatAppConfig(appConfig);
    const source = new RawSource(JSON.stringify(formatedAppConfig, null, 2));
    compilation.emitAsset(appFile, source);
  }

  // page json
  pages.forEach(page => {
    const pageDistPath = path.join(page.toLowerCase());
    const file = `${pageDistPath}.json`;

    if (monaStore.nativeEntryMap.get(path.join(configHelper.cwd, './src', page))) {
      return;
    }
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

    const source = new RawSource(JSON.stringify(pageConfig, null, 2));
    compilation.emitAsset(file, source);
  });
}

function processModuleFactory(cwd: string, handledModules: Set<string>) {
  function processModule(compilation: Compilation, module: NormalModule, page: string) {
    // production 模式下，optimization.concatenateModules默认开启，会对module做一些优化合并，导致module获取到的为ConcatenatedModule，所以这里取ConcatenatedModule.rootModule
    if (module instanceof ConcatenatedModule) {
      //@ts-ignore
      if (module.rootModule instanceof NormalModule) {
        //@ts-ignore
        module = module.rootModule;
      }
    }
    // 处理循环递归
    if (!module?.resource || handledModules.has(module?.resource)) {
      return;
    }
    handledModules.add(module.resource);
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

        let filePath = processNativePath(requestPath, module.context);

        const componentEntry = monaStore.nativeEntryMap.get(filePath);

        if (componentEntry instanceof MiniComponentEntry && componentEntry.templateInfo) {
          const { componentName } = componentEntry.templateInfo;
          let pageInfo = monaStore.pageEntires.get(page) || { usingComponents: {}, type: 'mona' };

          pageInfo.usingComponents = {
            ...(pageInfo.usingComponents || {}),
            // 计算页面和自定义组件两个绝对路径之间的相对路径
            [formatReactNodeName(componentName)]: getRelativePath(
              path.dirname(getPageEntryPath(page, cwd)),
              //TODO: 优化
              getPageEntryPath(path.join(componentEntry.outputDir, `./${componentEntry.basename}`), cwd),
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
export function addUsingComponents(compilation: Compilation, configHelper: ConfigHelper) {
  const pagesPath = new Map();

  configHelper.appConfig.pages.forEach(page => {
    const res = getPageEntryPath(page, configHelper.cwd);
    pagesPath.set(res, page);
  });

  const modules = Array.from(compilation.modules.values()) as NormalModule[];
  modules.forEach(module => {
    let resourcePath = module.resource?.replace(path.extname(module.resource), '');
    const pagePath = pagesPath.get(resourcePath);
    if (pagePath) {
      const processModule = processModuleFactory(configHelper.cwd, new Set());

      processModule(compilation, module, pagePath);
    }
  });
}
