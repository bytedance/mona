import ConfigHelper from '@/ConfigHelper';
import Config from 'webpack-chain';
import { TARGET } from './constants';
import { merge } from 'lodash';
export function chainResolve(webpackConfig: Config, configHelper: ConfigHelper) {
  const resolve = webpackConfig.resolve;
  resolve.extensions.merge(['.js', '.jsx', '.ts', '.tsx', '.json']);
  resolve.alias.merge(merge(genAlias(), configHelper.projectConfig.abilities?.alias));
}

export function genAlias() {
  return {
    '@bytedance/mona-runtime': `@bytedance/mona-runtime/dist/index.${TARGET}.js`,
  };
}
