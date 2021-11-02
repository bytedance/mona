import yargs from 'yargs';
import path from 'path';
import webpack from 'webpack';
import chalk from 'chalk';
import WebpackDevServer from 'webpack-dev-server';
import ConfigHelper, { DEAULT_HOST, DEFAULT_PORT } from './configHelper';
import { buildCommandUsage, startCommandUsage } from './help';

function build({ dev }: { dev: boolean }) {
  yargs.version(false).help(false);
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
        const devServerOptions = {
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
          allowedHosts: 'all'
        }
        const devServer = new WebpackDevServer(devServerOptions, webpackCompiler as any);

        devServer.startCallback(() => {
          console.log(`starting server on http://${DEAULT_HOST}:${port}`);
        });
      } else {
        webpackCompiler.run((error, stats) => {
          if (error) {
            throw error;
          }

          console.log('start bundling');
          const info = stats?.toJson();
          if (stats?.hasErrors()) {
            info?.errors?.forEach((err: any) => {
              console.error(err);
            });
            process.exit(1);
          }
          if (stats?.hasWarnings) {
            console.warn(info?.warnings?.join('\n'));
          }
          Object.keys(info?.assetsByChunkName || {}).forEach((chunkName) => {
            const assets = (info?.assetsByChunkName || {})[chunkName];
            console.info(`Chunk: ${chunkName}`);
            if (Array.isArray(assets)) {
              assets.forEach(asset => console.log(` file: ${asset}\n`))
            }
            console.log('')
          })
          console.log('bundle finish');
        });
      }
    } catch (err: any) {
      console.log(chalk.red(err.message));
    }
  }).alias('p', 'port').alias('h', 'help').argv;
}

export default build;
