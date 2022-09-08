import merge from 'lodash.merge';
import Config from 'webpack-chain';

import ConfigHelper from '@/ConfigHelper';

import { Platform } from '../constants';

const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];

export function chainResolve(webpackConfig: Config, configHelper: ConfigHelper, TARGET: Platform) {
  const resolve = webpackConfig.resolve;
  resolve.extensions.merge(extensions);
  resolve.alias.merge(merge(genAlias(TARGET), configHelper.projectConfig.abilities?.alias));
}

export function genAlias(TARGET: Platform) {
  return {
    '@bytedance/mona-runtime': `@bytedance/mona-runtime/dist/index.${TARGET}.js`,
  };
}
