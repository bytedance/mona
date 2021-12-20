import path from 'path';
import ejs from 'ejs';
import { Compilation, sources } from 'webpack';
import { ConfigHelper } from '@/configHelper';
import { ejsParamsMap } from '@/alias';
import { noChildElements } from '@/alias/constants';

import { renderPropsMap } from '../PerfTemplateRenderPlugin/store';

export function mergeAliasMap() {
  for (const nodeType of ejsParamsMap.keys()) {
    const allInfo = ejsParamsMap.get(nodeType);
    const codeUseInfo = renderPropsMap.get(nodeType);
    if (!codeUseInfo?.isUse) {
      ejsParamsMap.delete(nodeType);
    } else if (codeUseInfo.isRenderAllProps) {
    } else {
      const allPropAlias = allInfo.alias;
      const newPropAlias: Record<string, string> = {};
      for (const prop of Object.keys(codeUseInfo.renderProps)) {
        newPropAlias[prop] = allPropAlias[prop];
      }
      allInfo.alias = newPropAlias;
    }
  }
}

const RawSource = sources.RawSource;
export default async function createTtml(compilation: Compilation, configHelper: ConfigHelper) {
  const isDev = configHelper.options.dev;
  const { appConfig } = configHelper;
  const pages = appConfig.pages ?? [];
  if (configHelper.projectConfig.compilerOptimization) {
    mergeAliasMap();
  }

  const file = `base.ttml`;
  if (!compilation.getAsset(file)) {
    const tplPath = path.join(__dirname, '../../ejs', './base.ttml.ejs');
    let content = await ejs.renderFile(
      tplPath,
      {
        ejsParamsMap,
        noChildElements,
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

    const tplPath = path.join(__dirname, '../../ejs', './page.ttml.ejs');
    const content = await ejs.renderFile(tplPath, { pageId: pageDistPath });
    const source = new RawSource(content);
    compilation.emitAsset(file, source);
  });
}
