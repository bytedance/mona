// @ts-nocheck
import { merge } from 'webpack-merge';
import generateBaseConfig from './webpack.base.js';

const prodConfig = {
  mode: 'production',
};

export default function (projectConfig) {
  const baseConfig = generateBaseConfig(projectConfig);

  return merge(baseConfig, prodConfig);
}
