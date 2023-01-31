import path from 'path';
import Config from 'webpack-chain';

import { ConfigHelper } from '@bytedance/mona-manager';
import { MonaPlugins } from '@/plugins';

import { commonChainModuleRule } from '../utils/commonChainModuleRule';
import createPxtransformConfig from '../utils/createPxtransformConfig';
import { Platform } from '../constants';

function commonCssRule(styleRule: Config.Rule<Config.Module>, configHelper: ConfigHelper) {
  const { projectConfig } = configHelper;

  const pxtOptions = createPxtransformConfig(Platform.WEB, projectConfig);

  styleRule.use('style-loader').when(
    configHelper.isDev,
    r => r.loader(require.resolve('style-loader')),
    r => r.loader(MonaPlugins.MiniCssExtractPlugin.loader),
  );
  // styleRule.use('style-loader').loader(require.resolve('style-loader')
  const { typings } = projectConfig.abilities?.css || { typings: false };

  typings &&
    styleRule
      .use('@teamsupercell/typings-for-css-modules-loader')
      .loader(require.resolve('@teamsupercell/typings-for-css-modules-loader'));

  styleRule
    .use('cssLoader')
    .loader(require.resolve('css-loader'))
    .options({
      importLoaders: 2,
      modules: {
        auto: true,
        localIdentName: '[local]_[hash:base64:5]',
      },
    });
  styleRule
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      postcssOptions: {
        plugins: [
          pxtOptions.enabled
            ? [path.join(__dirname, '../../plugins/postcss/PostcssPxtransformer/index.js'), pxtOptions]
            : null,
        ].filter(p => p),
      },
    });
  return styleRule;
}

export function chainModuleRule(webpackConfig: Config, configHelper: ConfigHelper) {
  commonChainModuleRule({
    webpackConfig,
    configHelper,
    TARGET: Platform.H5,
    commonCssRule,
  });
}
