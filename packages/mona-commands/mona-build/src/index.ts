import yargs from 'yargs';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import ConfigHelper from './configHelper';

const DEFAULT_PORT = '9000';

function build({ dev }: { dev: boolean }) {
  yargs.version(false).help(false);
  yargs.command('$0', false, {}, async function (argv) {
    // 分析参数
    const port = argv.port as string || DEFAULT_PORT;
    const configHelper = new ConfigHelper({ ...argv, dev, port });

    // 生成webpack配置
    const webpackConfig = configHelper.generate();

    // 调用webpack进行打包
    const webpackCompiler = webpack(webpackConfig);

    if (dev) {
      const devServer = new WebpackDevServer(
        {
          static: {
            directory: path.join(configHelper.cwd, configHelper.projectConfig.output),
          },
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          // hot: true,
          open: true,
          historyApiFallback: true,
          // compress: true,
          port,
          host: '127.0.0.1',
          allowedHosts: 'all'
        },
        webpackCompiler as any
      );

      devServer.startCallback(() => {
        console.log(`starting server on http://localhost:${port}`);
      });
    } else {
      console.log('start build');
      webpackCompiler.run((error, stats) => {
        if (error) {
          throw error;
        }

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
        console.log('build finish');
      });
    }
  }).argv;
}

export default build;
