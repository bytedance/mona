import path from 'path';
import Config from 'webpack-chain';

import ConfigHelper from '@/ConfigHelper';
import { TARGET } from './constants';

import { genAlias } from './chainResolve';
import { MonaPlugins } from '@/plugins';

import createPxtransformConfig from '../utils/createPxtransformConfig';
import { NPM_DIR, NODE_MODULES } from '../constants';

export function chainModuleRule(webpackConfig: Config, configHelper: ConfigHelper) {
  createJsRule(webpackConfig, configHelper);
  createCssRule(webpackConfig, configHelper);
  createAssetRule(webpackConfig, configHelper);
  createTtmlRules(webpackConfig, configHelper);
}
function createTtmlRules(webpackConfig: Config, _configHelper: ConfigHelper) {
  function createRules(dir: string, exclude?: RegExp, namePrefix: string = '/') {
    const ttmlRule = webpackConfig.module
      .rule('ttml' + dir)
      .test(/\.ttml$/i)
      .include.add(new RegExp(dir))
      .end()
      .when(!!exclude, c => c.exclude.add(exclude));
    ttmlRule
      .use('fileLoader')
      .loader(require.resolve('file-loader'))
      .options({
        useRelativePath: true,
        name: path.join(namePrefix, '[path][name].ttml'),
        context: dir,
      });

    ttmlRule.use('ttmlLoader').loader(path.resolve(__dirname, '../../plugins/loaders/miniTemplateLoader'));
  }
  createRules('src', new RegExp(NODE_MODULES));
  createRules(NODE_MODULES, undefined, NPM_DIR);
}
function createJsRule(webpackConfig: Config, configHelper: ConfigHelper) {
  const { projectConfig, cwd } = configHelper;
  const { TransformJsxNamePlugin, collectNativeComponent } = MonaPlugins.babel;
  const jsRule = webpackConfig.module.rule('js').test(/\.((j|t)sx?)$/i);

  jsRule
    .use('transformJsxName')
    .loader(require.resolve('babel-loader'))
    .options({
      babelrc: false,
      plugins: [
        TransformJsxNamePlugin,
        projectConfig.compilerOptimization && MonaPlugins.babel.perfTemplateRender,
      ].filter(Boolean),
    });

  jsRule
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      babelrc: false,
      plugins: [
        collectNativeComponent.bind(null, configHelper),
        projectConfig.enableMultiBuild && [
          path.join(__dirname, '../../plugins/babel/BabelPluginMultiTarget.js'),
          { target: TARGET, context: cwd, alias: genAlias() },
        ],
      ].filter(Boolean),
      // ! mini端，'@babel/preset-react'，不要添加 "runtime": "automatic" 配置。 可能会导致perfTemplateRender插件收集props遗漏
      presets: [
        ['@babel/preset-env'],
        ['@babel/preset-typescript'],
        ['@babel/preset-react', { throwIfNamespace: false }],
      ],
    });

  jsRule
    .use('ttComponentLoader')
    .loader(path.resolve(__dirname, '../../plugins/loaders/ImportCustomComponentLoader'))
    .options({ target: TARGET, configHelper })
    .end();
}
function createCssRule(webpackConfig: Config, configHelper: ConfigHelper) {
  const { projectConfig } = configHelper;

  const pxtOptions = createPxtransformConfig(TARGET, projectConfig);

  const styleRule = webpackConfig.module.rule('style').test(/\.(c|le)ss$/i);
  const ttssRule = webpackConfig.module.rule('ttssStyle').test(/\.ttss$/i);
  function createRule(styleRule: Config.Rule<Config.Module>) {
    styleRule.use('MiniCssExtractPlugin.loader').loader(MonaPlugins.MiniCssExtractPlugin.loader);

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
          // localIdentName: '[local]_[hash:base64:5]',
          localIdentName: configHelper.isDev ? '[path][name]__[local]' : '[local]_[hash:base64:5]',
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
  }
  createRule(styleRule);
  createRule(ttssRule);

  styleRule
    .use('less')
    .loader(require.resolve('less-loader'))
    .options({
      lessOptions: {
        javascriptEnabled: true,
      },
    });
}

function createAssetRule(webpackConfig: Config, _configHelper: ConfigHelper) {
  webpackConfig.module
    .rule('img')
    .test(/\.(png|jpe?g|gif|webp)$/i)
    .set('type', 'asset/resource')
    .set('generator', {
      filename: 'static/img/[hash][ext][query]',
    });
  webpackConfig.module
    .rule('svg')
    .test(/\.svg$/i)
    .set('type', 'asset/resource')
    .set('generator', {
      filename: 'static/img/[hash][ext][query]',
    });
  webpackConfig.module
    .rule('font')
    .test(/\.(ttf|eot|woff|woff2)$/i)
    .set('type', 'asset/resource')
    .set('generator', {
      filename: 'static/font/[hash][ext][query]',
    });
}
