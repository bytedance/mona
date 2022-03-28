import ConfigHelper from '@/ConfigHelper';
import path from 'path';
import Config from 'webpack-chain';
import { TARGET } from './constants';
import { merge } from 'lodash';
export function chainResolve(webpackConfig: Config, configHelper: ConfigHelper) {
  const resolve = webpackConfig.resolve;
  resolve.extensions.merge(['.js', '.jsx', '.ts', '.tsx', '.json']);
  resolve.alias.merge(merge(genAlias(configHelper.cwd), configHelper.projectConfig.abilities?.alias));
}

export function genAlias(cwd: string) {
  return {
    '@bytedance/mona-runtime': path.resolve(cwd, `node_modules/@bytedance/mona-runtime/dist/index.${TARGET}.js`),
  };
}
