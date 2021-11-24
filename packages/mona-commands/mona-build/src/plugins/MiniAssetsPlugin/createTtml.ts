import path from 'path';
import ejs from 'ejs';
import { Compilation, sources } from 'webpack'
import { ConfigHelper } from '@/configHelper';

const RawSource = sources.RawSource;

export default async function createTtml(compilation: Compilation, configHelper: ConfigHelper) {
  const { appConfig } = configHelper;
  const pages = appConfig.pages ?? [];
  
  // base ttml
  const file = `base.ttml`;
  if (!compilation.getAsset(file)) {
    const tplPath = path.join(__dirname, '../../ejs', './base.ttml.ejs');
    const content = await ejs.renderFile(tplPath, {});
    const source = new RawSource(content);

    compilation.emitAsset(file, source)
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
    compilation.emitAsset(file, source)
  })
}