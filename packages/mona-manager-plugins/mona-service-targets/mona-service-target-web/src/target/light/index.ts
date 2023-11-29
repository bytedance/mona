import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { IPlugin } from '@bytedance/mona-manager';
import chain from '../utils/chain';
import LightApiPlugin from '@/plugins/webpack/LightApiPlugin';
import MobileAppJsonPlugin from '@/plugins/webpack/MobileAppJsonPlugin';
import path from 'path';
import configPostcssPlugin from '../utils/configPostcssPlugin';

const { LIGHT } = Platform;

const light: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(LIGHT, tctx => {
    tctx.chainWebpack(webpackConfig => {
      chain(webpackConfig, configHelper, LIGHT);
      const { projectConfig } = configHelper;

      webpackConfig.output
        .libraryTarget('umd')
        .globalObject('window');
      webpackConfig.output.set('chunkLoadingGlobal', `webpackJsonp_${projectConfig.projectName}_${Date.now()}`);

      webpackConfig.plugin('LightApiPlugin').use(LightApiPlugin, [projectConfig.appId as string]);
      webpackConfig.plugin('MobileAppJsonPlugin').use(MobileAppJsonPlugin, [configHelper]);

      // style
      const { library, runtime } = projectConfig;
      const injectMonaUi = library || runtime?.monaUi;
      const monaUiPrefix = typeof injectMonaUi === 'object' ? injectMonaUi?.prefixCls : undefined;

      if (!monaUiPrefix) {
        configPostcssPlugin(webpackConfig, [
          path.join(__dirname, '../../plugins/postcss/monaUiPrefix.js')
        ])
      }
    });
  });
};

module.exports = light;
