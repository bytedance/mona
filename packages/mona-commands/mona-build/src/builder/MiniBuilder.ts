
import BaseBuilder from '@/builder/BaseBuilder';
import compilerCallback from '@/utils/compilerCallback';
import chalk from 'chalk';

class MiniBuilder extends BaseBuilder {

  build() {
    console.log(chalk.cyan('开始打包'))
    this.compiler.run(compilerCallback(true));
  }
  
  start() {
    console.log(chalk.cyan('开始打包'))
    this.compiler.watch({
       aggregateTimeout: 200,
    }, compilerCallback(false));
  }
}

export default MiniBuilder;