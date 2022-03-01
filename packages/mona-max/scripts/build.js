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
      const config = require('../config/webpack.prod')

      console.log(chalk.yellow(`🏃 正在打包构建组件......`));
      const umdConfig = config('umd')
      const esmConfig = config('esm')

      webpack(umdConfig, (err, stats) => handleError(err, stats, 'umd'));

      webpack(esmConfig, (err, stats) => handleError(err, stats, 'esm'));
    }
  )
}

module.exports = maxBuild
