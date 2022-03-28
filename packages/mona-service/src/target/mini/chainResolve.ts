import ConfigHelper from '@/ConfigHelper';
import path from 'path';
import { merge } from 'lodash';

import Config from 'webpack-chain';
import { TARGET } from './constants';
const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];

export function chainResolve(webpackConfig: Config, configHelper: ConfigHelper) {
  const resolve = webpackConfig.resolve;
  resolve.extensions.merge(extensions);
  resolve.alias.merge(merge(genAlias(configHelper.cwd), configHelper.projectConfig.abilities?.alias));
}

export function genAlias(cwd: string) {
  return {
    '@bytedance/mona-runtime': path.resolve(cwd, `node_modules/@bytedance/mona-runtime/dist/index.${TARGET}.js`),
  };
}
