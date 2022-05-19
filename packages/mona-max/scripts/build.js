const chalk = require('chalk');
const webpack = require('webpack')
const handleError = require('../utils/handleError');

const maxBuild = (ctx) => {
  ctx.registerCommand(
    'max-build',
    {
      description: '店铺装修组件打包',
      usage: 'mona-service max-build',
    },
    () => {
      console.log(chalk.yellow(`🏃 正在打包构建组件......`));

      const umdConfig = require('../config/webpack.prod')('umd')
      webpack(umdConfig, (err, stats) => handleError(err, stats, 'umd'));
      delete require.cache[require.resolve("../config/webpack.prod")]

      const esmConfig = require('../config/webpack.prod')('esm')
      webpack(esmConfig, (err, stats) => handleError(err, stats, 'esm'));
    }
  )
}

module.exports = maxBuild
