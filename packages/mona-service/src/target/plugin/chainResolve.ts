import ConfigHelper from '@/ConfigHelper';
import { merge } from 'lodash';

import Config from 'webpack-chain';
import { TARGET } from './constants';

const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];

export function chainResolve(webpackConfig: Config, configHelper: ConfigHelper) {
  const resolve = webpackConfig.resolve;
  resolve.extensions.merge(extensions);
  // resolve.modules.merge(['node_modules']);
  resolve.alias.merge(merge(genAlias(), configHelper.projectConfig.abilities?.alias));
}

export function genAlias() {
  return {
    '@bytedance/mona-runtime': `@bytedance/mona-runtime/dist/index.${TARGET}.js`,
  };
}
