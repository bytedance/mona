import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { IPlugin } from '@bytedance/mona-manager';
import { MonaPlugins } from '@/plugins';
import chain from '../utils/chain';
import createPxtransformConfig from '../utils/createPxtransformConfig';
import configPostcssPlugin from '../utils/configPostcssPlugin';

const { H5 } = Platform;

const mobile: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(H5, tctx => {
    tctx.chainWebpack(webpackConfig => {
      chain(webpackConfig, configHelper, H5);
      const { projectConfig } = configHelper;
      // webpackConfig.output
      //   .pathinfo(false)
      //   .path(path.join(cwd, projectConfig.output))
      //   .chunkFilename('[id].bundle.js')
      //   .publicPath('/');

      // if (process.env.ENTRY_TYPE === 'js' && !configHelper.isDev) {
      //   // webpackConfig.externals({ react: 'react', 'react-dom': 'react-dom', 'react-router-dom': 'react-router-dom' });
      //   // webpackConfig.output.libraryTarget('umd');
      // }
      if (configHelper.isDev) {
        webpackConfig.plugin('MaxSubAutoTypeWebpackPlugin').use(MonaPlugins.MobileAutoTypePlugin)
      }

      const pxtOptions = createPxtransformConfig(Platform.WEB, projectConfig);
      if (pxtOptions.enabled) {
        configPostcssPlugin(webpackConfig, [
          require.resolve(
            '@bytedance/mona-manager-plugins-shared/dist/plugins/postcss/PostcssPxtransformer/index.js',
          ),
          pxtOptions,
        ])
      }
    });
  });
};

module.exports = mobile;
