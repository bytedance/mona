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

module.exports = function ({ buildType = 'umd', entry, pxToRem = false, useWebExt = false, appid = '' }) {
  const baseConfig = generateBaseConfig({ entry, pxToRem, useWebExt, appid });
  const moduleConfig = buildType === 'umd' ? umdConfig : esmConfig;

  return merge(baseConfig, prodConfig, moduleConfig);
};
