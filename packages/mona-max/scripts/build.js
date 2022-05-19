const chalk = require('chalk');

const maxBuild = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.overrideBuildCommand(() => {
      console.log(chalk.yellow(`🏃 正在打包构建组件......`));
      const umdConfig = require('../config/webpack.prod')('umd')
      tctx.configureWebpack(umdConfig);
      delete require.cache[require.resolve("../config/webpack.prod")]
      const esmConfig = require('../config/webpack.prod')('esm')
      tctx.configureWebpack(esmConfig);
    })

  });
};

module.exports = maxBuild;
