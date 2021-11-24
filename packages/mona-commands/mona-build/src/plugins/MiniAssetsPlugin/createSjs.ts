import path from 'path';
import ejs from 'ejs';
import { Compilation, sources } from 'webpack'

const RawSource = sources.RawSource;

export default async function createSjs(compilation: Compilation) {
  const file = `runtime.sjs`;

  if (compilation.getAsset(file)) {
    return;
  }

  const tplPath = path.join(__dirname, '../../ejs', './runtime.sjs.ejs');
  const content = await ejs.renderFile(tplPath, {});
  const source = new RawSource(content);
  
  compilation.emitAsset(file, source)
}