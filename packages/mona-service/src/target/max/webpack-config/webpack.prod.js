const { merge } = require('webpack-merge');

const path = require('path');
const fs = require('fs-extra');

const generateBaseConfig = require('./webpack.base.js');
delete require.cache[require.resolve('./webpack.base.js')];
const umdConfig = require('./build-umd-config.js');
const esmConfig = require('./build-esm-config.js');

const prodConfig = {
  mode: 'production',
};

module.exports = function (buildType, entry, pxToRem, useWebExt = false) {
  const baseConfig = generateBaseConfig({ entry, pxToRem, useWebExt });
  const moduleConfig = buildType === 'umd' ? umdConfig : esmConfig;

  return merge(baseConfig, prodConfig, moduleConfig);
};
