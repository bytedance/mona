import path from 'path';
import ejs from 'ejs';
import { Compilation, sources } from 'webpack';
import { ConfigHelper } from '@/configHelper';
import { noChildElements } from '@/alias/constants';
import { RENDER_NODE } from '@bytedance/mona-shared';

import monaStore from '../../../store';

export function getAliasMap(ejsParamsMap: Map<string, any>) {
  const result = new Map();
  for (const nodeType of ejsParamsMap.keys()) {
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
export default async function createTtml(compilation: Compilation, configHelper: ConfigHelper) {
  const isDev = configHelper.options.dev;
  const { appConfig } = configHelper;
  const pages = appConfig.pages ?? [];
  let renderTemplateAliasMap = monaStore.ejsParamsMap;
  if (configHelper.projectConfig.compilerOptimization) {
    renderTemplateAliasMap = getAliasMap(renderTemplateAliasMap);
  }

  const file = `base.ttml`;
  if (!compilation.getAsset(file)) {
    const tplPath = path.join(__dirname, '../../../ejs', './base.ttml.ejs');
    let content = await ejs.renderFile(
      tplPath,
      {
        ejsParamsMap: renderTemplateAliasMap,
        noChildElements,
        RENDER_NODE,
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

    // generate ttml file
    const file = `${pageDistPath}.ttml`;
    if (compilation.getAsset(file)) {
      return;
    }

    const tplPath = path.join(__dirname, '../../../ejs', './page.ttml.ejs');
    const content = await ejs.renderFile(tplPath, { pageId: pageDistPath });
    const source = new RawSource(content);
    compilation.emitAsset(file, source);
  });
}
