const chalk = require('chalk');
const webpack = require('webpack')
const config = require('../config/webpack.prod')


const maxBuild = (ctx) => {
  ctx.registerCommand(
    'max-build',
    {
      description: '店铺装修组件打包',
      usage: 'mona-service max-build',
    },
    () => {
      console.log(chalk.yellow(`🏃 正在打包构建组件......`));
      const umdConfig = config('umd')
      const esmConfig = config('esm')

      webpack(umdConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
          console.log(`❌ ${chalk.red('umd构建错误！')}`);
          console.log(err)
        }
      });

      webpack(esmConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
          console.log(`❌ ${chalk.red('esm构建错误！')}`);
          console.log(err)
        }
      });
    }
  )
}

module.exports = maxBuild
