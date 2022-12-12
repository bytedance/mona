import { merge } from 'webpack-merge';
import path from 'path';
import fs from 'fs-extra';
import esmConfig from './build-esm-config';

import generateBaseConfig from './webpack.base';

import umdConfig from './build-umd-config';

const prodConfig = {
  mode: 'production',
};

export default function (projectConfig) {
  const buildType = projectConfig.buildType || 'umd';
  const baseConfig = generateBaseConfig(projectConfig);
  const moduleConfig = buildType === 'umd' ? umdConfig : esmConfig;

  return merge(baseConfig, prodConfig, moduleConfig);
}
