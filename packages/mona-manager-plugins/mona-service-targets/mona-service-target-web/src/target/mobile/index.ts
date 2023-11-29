import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { IPlugin } from '@bytedance/mona-manager';
import chain from '../utils/chain';
import MobileAppJsonPlugin from '@/plugins/webpack/MobileAppJsonPlugin';
import MobileAutoTypePlugin from '@/plugins/webpack/MobileAutoTypePlugin';
import createPxtransformConfig from '../utils/createPxtransformConfig';
import configPostcssPlugin from '../utils/configPostcssPlugin';

const { MOBILE } = Platform;

const mobile: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(MOBILE, tctx => {
    tctx.chainWebpack(webpackConfig => {
      chain(webpackConfig, configHelper, MOBILE);
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
        webpackConfig.plugin('MaxSubAutoTypeWebpackPlugin').use(MobileAutoTypePlugin)
      }
       webpackConfig.plugin('MobileAppJsonPlugin').use(MobileAppJsonPlugin, [configHelper]);

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
