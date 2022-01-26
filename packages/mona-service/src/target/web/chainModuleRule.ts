import path from 'path';
import Config from 'webpack-chain';

import ConfigHelper from '@/ConfigHelper';

import { genAlias } from './chainResolve';
import { MonaPlugins } from '../plugins';
import createPxtransformConfig from '../utils/createPxtransformConfig';

export function chainModuleRule(webpackConfig: Config, configHelper: ConfigHelper) {
  createJsRule(webpackConfig, configHelper);
  createCssRule(webpackConfig, configHelper);
  createAssetRule(webpackConfig, configHelper);
}

function createJsRule(webpackConfig: Config, configHelper: ConfigHelper) {
  const isProd = process.env.NODE_ENV === 'production';
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
        [require.resolve('@babel/preset-react')],
      ],
      plugins: [
        // Todo
        MonaPlugins.babel.collectNativeComponent.bind(null, configHelper),
        [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
        !isProd && require.resolve('react-refresh/babel'),
        projectConfig.enableMultiBuild && [
          path.join(__dirname, '../plugins/babel/BabelPluginMultiTarget.js'),
          { target: 'web', context: cwd, alias: genAlias(cwd) },
        ],
      ].filter(Boolean),
    });
  jsRule
    .use('ttComponentLoader')
    .loader(path.resolve(__dirname, '../loaders/ImportCustomComponentLoader'))
    .options({ target: 'web' });
}
function createCssRule(webpackConfig: Config, configHelper: ConfigHelper) {
  const { projectConfig } = configHelper;
  const isProd = process.env.NODE_ENV === 'production';

  const pxtOptions = createPxtransformConfig('web', projectConfig);

  const cssRule = webpackConfig.module.rule('css').test(/\.(c|le)ss$/i);

  createRule(cssRule);

  function createRule(styleRule: Config.Rule<Config.Module>) {
    styleRule.use('style-loader').when(
      !isProd,
      r => r.loader(require.resolve('style-loader')),
      r => r.loader(MonaPlugins.MiniCssExtractPlugin.loader),
    );
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
            require.resolve('postcss-import'),
            pxtOptions.enabled
              ? [path.join(__dirname, '../plugins/postcss/PostcssPxtransformer/index.js'), pxtOptions]
              : null,
          ].filter(p => p),
        },
      });
    styleRule
      .use('less')
      .loader(require.resolve('less-loader'))
      .options({
        lessOptions: {
          javascriptEnabled: true,
        },
      });
  }
}

function createAssetRule(webpackConfig: Config, configHelper: ConfigHelper) {
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
