import path from 'path';
import Config from 'webpack-chain';

import ConfigHelper from '@/ConfigHelper';
import { MonaPlugins } from '@/plugins';

import { genAlias } from './chainResolve';
import { Platform } from '../constants';

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
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      babelrc: false,
      // https://github.com/babel/babel/issues/12731
      sourceType: 'unambiguous',
      presets: [
        [require.resolve('@babel/preset-env')],
        [require.resolve('@babel/preset-typescript')],
        [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
      ],
      plugins: [
        // Todo
        MonaPlugins.babel.collectNativeComponent.bind(null, configHelper),
        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
        configHelper.isDev && require.resolve('react-refresh/babel'),
        projectConfig.enableMultiBuild && [
          path.join(__dirname, '../../plugins/babel/BabelPluginMultiTarget.js'),
          { target: TARGET, context: cwd, alias: genAlias(TARGET) },
        ],
      ].filter(Boolean),
    });
  jsRule
    .use('ttComponentLoader')
    .loader(path.resolve(__dirname, '../../plugins/loaders/ImportCustomComponentLoader'))
    .options({ target: TARGET, configHelper });
}

function createLessRule({ webpackConfig, configHelper, commonCssRule }: ModuleRule) {
  const lessRule = webpackConfig.module.rule('less').test(/\.less$/i);
  commonCssRule(lessRule, configHelper)
    .use('less')
    .loader(require.resolve('less-loader'))
    .options({
      lessOptions: {
        math: 'always',
        javascriptEnabled: true,
      },
    });
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
