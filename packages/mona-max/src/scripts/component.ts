// @ts-nocheck
import  child_process from 'child_process'
import chalk from 'chalk';
import path from 'path';
import type { IPlugin } from '@bytedance/mona-service';


const maxComponent:IPlugin = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.configureWebpack(() => {
      ctx.configHelper.projectConfig.chain = pre => pre;
      if (process.env.NODE_ENV === 'production') {
        return require('../../config/webpack.prod')(ctx.configHelper.projectConfig);
      }

      return require('../../config/webpack.dev')(ctx.configHelper.projectConfig);
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
      child_process.exec(`node ${configPath}`, function (error, stdout, stderr) {
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
      child_process.exec('mona-service build -t max',  function (error, stdout, stderr) {
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
      child_process.exec('mona-service start -t max',function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
        }
        console.log(stdout);
      });
    },
  );
};

export  default maxComponent;
