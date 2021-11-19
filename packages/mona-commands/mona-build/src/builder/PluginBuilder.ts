import path from 'path';
import chalk from 'chalk';
import WebpackDevServer from 'webpack-dev-server';
import BaseBuilder from "@/builder/BaseBuilder";
import { DEAULT_HOST, DEFAULT_PORT } from '@/constants';

class PluginBuilder extends BaseBuilder {
  start() {
    const { cwd, projectConfig } = this.configHelper;
    const staticDir = path.join(cwd, projectConfig.output);
    const port = projectConfig.dev?.port || DEFAULT_PORT;

    const devServer = new WebpackDevServer({
      static: {
        directory: staticDir,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      hot: true,
      open: true,
      historyApiFallback: true,
      compress: true,
      port,
      host: DEAULT_HOST,
      allowedHosts: 'all',
    }, this.compiler);

    devServer.startCallback(() => {
      console.log(`starting server on http://${DEAULT_HOST}:${port}`);
    });
  }

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
}

export default PluginBuilder;