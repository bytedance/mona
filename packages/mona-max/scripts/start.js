const chalk = require('chalk');

const maxStart = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.overrideStartCommand(() => {
      console.log(chalk.yellow(`🏃 正在启动组件......`));
      const umdConfig = require('../config/webpack.dev')('umd')
      delete require.cache[require.resolve("../config/webpack.dev")]
      const compiler = tctx.configureWebpack(umdConfig);
      const devServer = new WebpackDevServer({...umdConfig.devServer}, compiler);
      devServer.startCallback(() => {
        console.log(chalk.green('服务启动成功'));
      });
    })

  });
};

module.exports = maxStart;
