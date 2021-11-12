import yargs from 'yargs';
import path from 'path';
import webpack from 'webpack';
import chalk from 'chalk';
import WebpackDevServer from 'webpack-dev-server';
import ConfigHelper, { DEAULT_HOST, DEFAULT_PORT } from './configHelper';
import { buildCommandUsage, startCommandUsage } from './help';

function build({ dev }: { dev: boolean }) {
  yargs.version(false).help(false).alias('p', 'port').alias('h', 'help');
  yargs.command('$0', false, {}, async function (argv) {
    if (argv.help) {
      const helpInfo = dev ? startCommandUsage() : buildCommandUsage();
      console.log(helpInfo);
      return;
    }

    try {
      // 分析参数
      const configHelper = new ConfigHelper({ ...argv, dev, port: argv.port as string });
      const port = configHelper.projectConfig.dev?.port || DEFAULT_PORT

      // 生成webpack配置
      const webpackConfig = configHelper.generate();

      // 调用webpack进行打包
      const webpackCompiler = webpack(webpackConfig);

      if (dev) {
        const devServer = new WebpackDevServer({
          static: {
            directory: path.join(configHelper.cwd, configHelper.projectConfig.output),
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
        }, webpackCompiler as any);

        devServer.startCallback(() => {
          console.log(`starting server on http://${DEAULT_HOST}:${port}`);
        });
      } else {
        console.log(chalk.cyan('开始打包'))
        webpackCompiler.run((error, stats) => {
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
    } catch (err: any) {
      console.log(chalk.red(err.message));
      console.log(err);
    }
  }).argv;
}

export default build;
