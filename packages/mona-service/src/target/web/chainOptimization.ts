import Config from 'webpack-chain';
import { MonaPlugins } from '../plugins';

export function chainOptimization(webpackConfig: Config) {
  const optimization = webpackConfig.optimization;
  const { TerserWebpackPlugin, CssMinimizerPlugin } = MonaPlugins;
  const isProd = process.env.NODE_ENV === 'production';
  optimization.when(isProd, op =>
    op
      .minimize(true)
      .minimizer('TerserWebpackPlugin')
      .use(new TerserWebpackPlugin({ parallel: true, extractComments: false }))
      .end()
      .minimizer('CssMinimizerPlugin')
      .use(CssMinimizerPlugin)
      .end()
      .splitChunks({
        chunks: 'async',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          reactBase: {
            name: 'react-chunk',
            test: /react/,
            chunks: 'initial',
            priority: 10,
          },
          common: {
            name: 'common',
            chunks: 'initial',
            priority: 2,
            minChunks: 2,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      }),
  );
}
