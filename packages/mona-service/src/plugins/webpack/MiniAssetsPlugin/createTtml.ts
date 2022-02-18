import path from 'path';
import ejs from 'ejs';
import { Compilation, sources } from 'webpack';
import ConfigHelper from '@/ConfigHelper';

import { voidChildrenElements } from '@/target/mini/baseComponents/constants';
import { RENDER_NODE, ComponentType, CUSTOM_REF } from '@bytedance/mona-shared';
import { miniExt } from '@/target/mini/constants';

import monaStore from '@/target/store';
import { formatReactNodeName } from '@/target/utils/reactNode';

const ejsRelativePath = '../../../assets/ejs';

export function getAliasMap(ejsParamsMap: Map<string, any>) {
  const result = new Map();
  for (const nodeType of Array.from(ejsParamsMap.keys())) {
    const allInfo = JSON.parse(JSON.stringify(ejsParamsMap.get(nodeType)));
    const codeUseInfo = monaStore.templateRenderMap.get(nodeType);
    if (!codeUseInfo?.isUse) {
    } else if (codeUseInfo.isRenderAllProps) {
      result.set(nodeType, allInfo);
    } else {
      const allPropAlias = allInfo.alias;
      const newPropAlias: Record<string, string> = {};
      for (const prop of Object.keys(codeUseInfo.renderProps)) {
        newPropAlias[prop] = allPropAlias[prop];
      }
      result.set(nodeType, {
        ...allInfo,
        alias: newPropAlias,
      });
    }
  }
  return result;
}

const RawSource = sources.RawSource;

function genNativeEjsData() {
  const result = new Map();
  monaStore.nativeEntryMap.forEach(entry => {
    if (entry.templateInfo) {
      const { componentName, props } = entry.templateInfo;
      result.set(entry.id, {
        id: entry.id,
        name: componentName,
        props: Array.from(props.values()).reduce((pre, item) => {
          // 自定组件ref比较特殊,约定__ref透传react的ref
          // https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/custom-component/ref/
          const propKey = item === 'ref' ? 'tt:ref' : formatReactNodeName(item);
          const propValue = item === 'ref' ? CUSTOM_REF : item;

          pre[propKey] = propValue;
          return pre;
        }, {} as Record<string, string>),
      });
    }
  });

  return result;
}

export default async function createTtml(compilation: Compilation, configHelper: ConfigHelper) {
  const isDev = configHelper.isDev;
  const { appConfig } = configHelper;
  const pages = appConfig.pages ?? [];
  let miniComponents = monaStore.ejsParamsMap;
  if (configHelper.projectConfig.compilerOptimization) {
    miniComponents = getAliasMap(miniComponents);
  }

  const file = `base.ttml`;
  if (!compilation.getAsset(file)) {
    const tplPath = path.join(__dirname, ejsRelativePath, './base.ttml.ejs');
    let content = await ejs.renderFile(
      tplPath,
      {
        miniComponents,
        nativeComponents: genNativeEjsData(),
        voidChildrenElements,
        RENDER_NODE,
        PTextName: ComponentType.ptext,
      },
      {
        rmWhitespace: !isDev,
      },
    );
    if (!isDev) {
      content = content.replace(/^\s*$(?:\r\n?|\n)/gm, '').replace(/\r\n|\n/g, ' ');
    }
    const source = new RawSource(content);

    compilation.emitAsset(file, source);
  }

  // page ttml
  pages.forEach(async page => {
    const pageDistPath = path.join(page.toLowerCase());
    if (monaStore.nativeEntryMap.get(path.join(configHelper.cwd, './src', page))) {
      return;
    }

    // generate ttml file
    const file = `${pageDistPath}${miniExt}`;
    if (compilation.getAsset(file)) {
      return;
    }

    const tplPath = path.join(__dirname, ejsRelativePath, `./page${miniExt}.ejs`);
    const content = await ejs.renderFile(tplPath, { pageId: pageDistPath });
    const source = new RawSource(content);
    compilation.emitAsset(file, source);
  });
}
