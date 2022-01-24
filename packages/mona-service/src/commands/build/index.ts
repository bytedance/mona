import webpack from 'webpack';
import chalk from 'chalk';
import ora from 'ora';
import { IPlugin } from '../../Service';

const build: IPlugin = (ctx) => {
  ctx.registerCommand('build', {
    description: '对项目进行打包',
    options: [
      { name: 'help', description: '输出帮助信息', alias: 'h' },
      { name: 'target', description: '指定打包类型', alias: 't' },
    ],
  }, (_, builder) => {
    const webpackConfig = builder?.resolveWebpackConfig();
    if (!webpackConfig) {
      return;
    }

    const compiler = webpack(webpackConfig);

    const spinner = ora('编译中...').start()
    spinner.color = 'green';

    compiler.run((error: any, stats: any) => {
      if (error) {
        throw error;
      }

      const info = stats?.toJson();

      if (stats?.hasErrors()) {
        info?.errors?.forEach((err: Error) => {
          console.log(chalk.red(err.message));
        });
        spinner.fail('编译失败')
        process.exit(1);
      }

      if (stats?.hasWarnings()) {
        info?.warnings?.forEach((w: Error) => {
          console.log(chalk.yellow(w.message));
        });
      }
      
      spinner.succeed(`编译成功 ${new Date().toLocaleString()}`)
        process.exit(0)
      })
    })
}

module.exports = build;