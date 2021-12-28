
import BaseBuilder from '@/builder/BaseBuilder';
import log from '@/log';
import runBuild from '@/utils/runBuild';
import path from 'path';
import chalk from 'chalk';
class MiniBuilder extends BaseBuilder {
  welcome() {
    const { configHelper } = this;
    const { projectConfig } = configHelper;
    console.log('')
    log(['配置', '产物目录', path.join(configHelper.cwd, projectConfig.output)])
    log(['配置', '打包入口', path.join(configHelper.cwd, projectConfig.input)])
    console.log('')
    console.log('')
  }

  build() {
    this.welcome();
    
    runBuild(this.compiler);
  }
  
  start() {
    this.welcome();

    this.compiler.watch({
       aggregateTimeout: 200,
    }, (error: any, stats: any) => {
      if (error) {
        throw error;
      }

      const info = stats?.toJson();
      if (stats?.hasErrors()) {
        info?.errors?.forEach((err: Error) => {
          console.log(chalk.red(err.message));
        });
        process.exit(1);
      }
      if (stats?.hasWarnings()) {
        info?.warnings?.forEach((w: Error) => {
          console.log(chalk.yellow(w.message));
        });
      }
      console.log(chalk.green(`✅  编译成功 ${new Date().toLocaleString()}`))
      console.log(chalk.gray('文件修改监听中...'));
    });
  }
}

export default MiniBuilder;