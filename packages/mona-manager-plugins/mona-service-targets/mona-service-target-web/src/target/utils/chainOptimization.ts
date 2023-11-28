// import { ConfigHelper } from '@bytedance/mona-manager';
import Config from 'webpack-chain';
// import { MonaPlugins } from '@/plugins';

export function chainOptimization(webpackConfig: Config) {
  const optimization = webpackConfig.optimization;

  optimization.splitChunks({
    chunks: 'all',
    minSize: 20000,
    // minRemainingSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    // enforceSizeThreshold: 50000,
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
      ui: {
        test: /(antd|auxo|mona-ui)/,
        priority: 3,
        name: 'antd',
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: -15,
      },
    },
  })
}
