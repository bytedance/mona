const child_process = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

let buildType = 'umd';
try {
  const cwd = process.cwd();
  const maxJsonPath = path.resolve(cwd, './mona.config.ts');
  const maxJson = fs.readFileSync(maxJsonPath, 'utf-8');
  buildType = maxJson.indexOf('buildType: "esm"') !== -1 ? 'esm' : 'umd';
} catch (e) {
  console.error(e);
}

const maxComponent = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.configureWebpack(() => {
      ctx.configHelper.projectConfig.chain = pre => pre;
      if (process.env.NODE_ENV === 'production') {
        return require('../config/webpack.prod')(buildType || 'umd');
      }

      return require('../config/webpack.dev')(buildType || 'umd');
    });
  });
  ctx.registerCommand(
    'max-template-start',
    {
      description: '店铺装修模版start',
      usage: 'mona-service max-template-start',
    },
    () => {
      const configPath = path.resolve(__dirname, '../utils/templateStart.js');
      child_process.execSync(`node ${configPath}`, function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
        }
        console.log(stdout);
      });
    },
  );
  ctx.registerCommand(
    'max-build',
    {
      description: '店铺装修组件打包',
      usage: 'mona-service max-build',
    },
    () => {
      console.log(chalk.bold.red("请更新build命令为 'mona-service build -t max'"));
      child_process.execSync('mona-service build -t max', { stdio: 'inherit' }, function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
        }
        console.log(stdout);
      });
    },
  );
  ctx.registerCommand(
    'max-start',
    {
      description: '店铺装修组件本地开发',
      usage: 'mona-service max-start',
    },
    () => {
      console.log(chalk.bold.red("请更新start命令为 'mona-service start -t max'"));
      child_process.execSync('mona-service start -t max', { stdio: 'inherit' }, function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
        }
        console.log(stdout);
      });
    },
  );
};

module.exports = maxComponent;
