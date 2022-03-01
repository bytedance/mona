const chalk = require('chalk');
const webpack = require('webpack')
const config = require('../config/webpack.dev')
const WebpackDevServer = require('webpack-dev-server')

const maxStart = (ctx) => {
  ctx.registerCommand(
    'max-start',
    {
      description: '店铺装修组件本地开发',
      usage: 'mona-service max-start',
    },
    () => {
      console.log(chalk.yellow(`🏃 正在启动组件.....`));
      const umdConfig = config('umd')
      const compiler = webpack(umdConfig);
      const devServer = new WebpackDevServer({...umdConfig.devServer}, compiler);
      devServer.startCallback(() => {
        console.log(chalk.green('服务启动成功'));
      });
    }
  )
}

module.exports = maxStart


