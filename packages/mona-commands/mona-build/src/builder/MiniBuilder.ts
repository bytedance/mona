
import BaseBuilder from '@/builder/BaseBuilder';
import chalk from 'chalk';

class MiniBuilder extends BaseBuilder {

  build() {
    console.log(chalk.cyan('开始打包'))
    this.compiler.run((error, stats) => {
      if (error) {
        throw error;
      }

      const info = stats?.toJson();
      if (stats?.hasErrors()) {
        info?.errors?.forEach(err => {
          console.log(chalk.red(err.message));
        });
        process.exit(1);
      }
      if (stats?.hasWarnings()) {
        info?.warnings?.forEach(w => {
          console.log(chalk.yellow(w.message));
        });
      }
      Object.keys(info?.assetsByChunkName || {}).forEach((chunkName) => {
        const assets = (info?.assetsByChunkName || {})[chunkName];
        console.info(chalk.green(`Chunk: ${chunkName}`));
        if (Array.isArray(assets)) {
          assets.forEach(asset => console.log(chalk.green(` file: ${asset}`)))
        }
        console.log('')
      })
      console.log(chalk.green('打包完成'));
      process.exit(0)
    });
  }
  
  start() {
    console.log('not implemented yet')
  }
}

export default MiniBuilder;