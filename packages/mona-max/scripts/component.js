
const child_process = require('child_process');
const chalk = require('chalk');

const maxComponent = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.configureWebpack(() => {
      if (process.env.NODE_ENV === 'production') {
        return require('../config/webpack.prod')('umd');
      }

      return require('../config/webpack.dev')('umd');
    })
  });
  ctx.registerCommand(
    'max-build',
    {
      description: '店铺装修组件打包',
      usage: 'mona-service max-build',
    },
    () => {
      console.log(chalk.bold.red("请更新build命令为 'mona-service build -t max'"))
      child_process.execSync('cross-env NODE_ENV=production mona-service build -t max', function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
        }
        console.log(stdout);
      })
    }
  )
  ctx.registerCommand(
    'max-start',
    {
      description: '店铺装修组件本地开发',
      usage: 'mona-service max-start',
    },
    () => {
      console.log(chalk.bold.red("请更新start命令为 'mona-service start -t max'"))
      child_process.execSync('cross-env NODE_ENV=development mona-service start -t max', function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
        }
        console.log(stdout);
      })
    }
  )
};

module.exports = maxComponent;
