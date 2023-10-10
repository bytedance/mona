import path from 'path';
import Config from 'webpack-chain';
import deepMerge from 'lodash.merge';
import { ConfigHelper } from '@bytedance/mona-manager';

import { genAlias } from './chainResolve';
import { Platform } from '@bytedance/mona-manager-plugins-shared';

type CommonCssRule = (styleRule: Config.Rule<Config.Module>, configHelper: ConfigHelper) => Config.Rule<Config.Module>;

interface ModuleRule {
  webpackConfig: Config;
  configHelper: ConfigHelper;
  TARGET: Platform;
  commonCssRule: CommonCssRule;
}

export function commonChainModuleRule(params: ModuleRule) {
  createJsRule(params);
  createCssRule(params);
  createLessRule(params);
  createAssetRule(params);
}

function createJsRule({ webpackConfig, configHelper, TARGET }: ModuleRule) {
  const { projectConfig, cwd } = configHelper;
  const jsRule = webpackConfig.module.rule('js').test(/\.((j|t)sx?)$/i);

  jsRule
    // .oneOf('babel')
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      cacheDirectory: true,
      cacheCompression: false,
      babelrc: false,
      // https://github.com/babel/babel/issues/12731
      sourceType: 'unambiguous',
      presets: [
        [
          require.resolve('@babel/preset-env'),
          TARGET === Platform.H5 && {
            // Overall browser coverage: 94% (2021-04-06)
            // https://browserslist.dev/?q=aU9TIDksIEFuZHJvaWQgNC40LCBsYXN0IDIgdmVyc2lvbnMsID4gMC4yJSwgbm90IGRlYWQ%3D
            targets: 'iOS 9, Android 4.4, last 2 versions, > 0.2%, not dead',
          },
        ].filter(Boolean),
        [require.resolve('@babel/preset-typescript')],
        [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
      ],
      plugins: [
        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
        [
          require.resolve('babel-plugin-import'),
          {
            libraryName: '@bytedance/mona-ui',
            libraryDirectory: 'es/components',
            style: true,
          },
        ],
        configHelper.isDev && require.resolve('react-refresh/babel'),
        projectConfig.enableMultiBuild && [
          //TODO:BabelPluginMultiTarget后面替换成@bytedance/mona-manager-plugins-shared
          path.join(__dirname, '../../plugins/babel/BabelPluginMultiTarget.js'),
          { target: TARGET, context: cwd, alias: genAlias(TARGET) },
        ],
        // coverage
        process.env.COVERAGE === '1' && [
          require.resolve('@bytedance/babel-coverage-plugin'),
          {
            coverageGlobalScopeFunc: false,
            coverageGlobalScope: 'window',
          },
        ],
      ].filter(Boolean),
    });
  // jsRule
  //   .use('ttComponentLoader')
  //   .loader(path.resolve(__dirname, '../../plugins/loaders/ImportCustomComponentLoader'))
  //   .options({ target: TARGET, configHelper });
}

function createLessRule({ webpackConfig, configHelper, commonCssRule }: ModuleRule) {
  const lessRule = webpackConfig.module.rule('less').test(/\.less$/i);
  const { library, runtime } = configHelper.projectConfig;
  const injectMonaUi = library || runtime?.monaUi;
  const monaUiPrefix = (typeof injectMonaUi === 'object' ? injectMonaUi?.prefixCls : 'mui') || 'mui';
  const modifyVars = injectMonaUi ? { '@auxo-prefix': monaUiPrefix } : {};

  commonCssRule(lessRule, configHelper)
    .use('less')
    .loader(require.resolve('less-loader'))
    .options(
      deepMerge(configHelper.projectConfig?.abilities?.less || {}, {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars,
          math: 'always',
        },
      }),
    );
}

function createCssRule({ webpackConfig, configHelper, commonCssRule }: ModuleRule) {
  const cssRule = webpackConfig.module.rule('css').test(/\.css$/i);
  commonCssRule(cssRule, configHelper);
}

function createAssetRule({ webpackConfig, configHelper }: ModuleRule) {
  const resourceType = 'asset/resource';
  const { projectConfig } = configHelper;

  webpackConfig.module
    .rule('img')
    .test(/\.(png|jpe?g|gif|webp)$/i)
    .set('type', resourceType);

  webpackConfig.module
    .rule('svg')
    .test(/\.svg$/i)
    .when(
      !!projectConfig.transformSvgToComponentInWeb,
      s => s.use('@svgr/webpack').loader(require.resolve('@svgr/webpack')),
      s => s.set('type', resourceType),
    );

  webpackConfig.module
    .rule('font')
    .test(/\.(ttf|eot|woff|woff2)$/i)
    .set('type', resourceType);
}
