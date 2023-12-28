import path from 'path';
import Config from 'webpack-chain';
import loaderUtils from 'loader-utils';

import { ConfigHelper } from '@bytedance/mona-manager';

import { commonChainModuleRule } from '../utils/commonChainModuleRule';
import { MonaPlugins } from '@/plugins';
import { Platform } from '@bytedance/mona-manager-plugins-shared';
import minimist from 'minimist';

function commonCssRule(styleRule: Config.Rule<Config.Module>, configHelper: ConfigHelper) {
  styleRule.use('style-loader').when(
    configHelper.isDev,
    r => r.loader(require.resolve('style-loader')),
    r => r.loader(MonaPlugins.MiniCssExtractPlugin.loader),
  );

  const { typings } = configHelper.projectConfig.abilities?.css || { typings: false };

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
        getLocalIdent: (loaderContext: any, localIdentName: string, localName: string, options: any) => {
          // 配合PostcssPreSelector插件
          if (localName === configHelper.buildId) {
            return localName;
          }

          if (!options.context) {
            options.context = loaderContext.rootContext;
          }

          const request = path.relative(options.context, loaderContext.resourcePath).replace(/\\/g, '/');

          options.content = `${options.hashPrefix + request}+${localName}`;

          localIdentName = localIdentName.replace(/\[local\]/gi, localName);

          const hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);

          return hash;
        },
      },
    });
  const cmdArgv = minimist(process.argv.slice(2));
  const target = cmdArgv.t;
  const { library, runtime } = configHelper.projectConfig;
  const injectMonaUi = library || runtime?.monaUi;
  const monaUiPrefix = typeof injectMonaUi === 'object' ? injectMonaUi?.prefixCls : undefined;

  styleRule
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      postcssOptions: {
        plugins: [
          [
            require.resolve('@bytedance/mona-manager-plugins-shared/dist/plugins/postcss/PostcssPreSelector.js'),
            { selector: `#${configHelper.buildId}` },
          ],
        ].map(a => a),
      },
    });

  return styleRule;
}

export function chainModuleRule(webpackConfig: Config, configHelper: ConfigHelper) {
  commonChainModuleRule({
    webpackConfig,
    configHelper,
    TARGET: Platform.PLUGIN,
    commonCssRule,
  });
}
