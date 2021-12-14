import path from 'path';
import ejs from 'ejs';
import { Compilation, sources } from 'webpack';
import { ConfigHelper } from '@/configHelper';
import { ejsParamsMap } from '@/alias';

const RawSource = sources.RawSource;
const templatePath = path.join(__dirname, '../../ejs/componentsEjs');
export default async function createTtml(compilation: Compilation, configHelper: ConfigHelper) {
  const isDev = configHelper.options.dev;
  const { appConfig } = configHelper;
  const pages = appConfig.pages ?? [];

  // base ttml
  const file = `base.ttml`;
  if (!compilation.getAsset(file)) {
    const tplPath = path.join(__dirname, '../../ejs', './base.ttml.ejs');
    let content = await ejs.renderFile(
      tplPath,
      {
        templatePath: templatePath,
        ejsParamsMap,
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
