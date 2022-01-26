import Config from 'webpack-chain';
import { MonaPlugins } from '../plugins';
const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];

export function chainOptimization(webpackConfig: Config) {
  const optimization = webpackConfig.optimization;
  const isProd = process.env.NODE_ENV === 'production';
  optimization
    .usedExports(true)
    .runtimeChunk('single')
    .splitChunks({
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: new RegExp(`(${extensions.filter(e => e !== '.json').join('|')})$`),
          chunks: 'initial',
          minChunks: 2,
          minSize: 0,
          priority: 10,
        },
      },
    });

  optimization.when(isProd, op => {
    op.minimizer('TerserWebpackPlugin')
      .use(new MonaPlugins.TerserWebpackPlugin({ parallel: true, extractComments: false }))
      .end()
      .minimizer('CssMinimizerPlugin')
      .use(new MonaPlugins.CssMinimizerPlugin({ test: /\.ttss(\?.*)?$/i }));
  });
}
