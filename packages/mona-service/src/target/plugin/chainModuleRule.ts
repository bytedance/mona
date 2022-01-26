import path from 'path';
import Config from 'webpack-chain';
import loaderUtils from 'loader-utils';

import ConfigHelper from '@/ConfigHelper';

import { genAlias } from './chainResolve';
import { MonaPlugins } from '../plugins';
import { TARGET } from './constants';

export function chainModuleRule(webpackConfig: Config, configHelper: ConfigHelper) {
  createJsRule(webpackConfig, configHelper);
  createCssRule(webpackConfig, configHelper);
  createAssetRule(webpackConfig, configHelper);
}

function createJsRule(webpackConfig: Config, configHelper: ConfigHelper) {
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
        configHelper.isDev && require.resolve('react-refresh/babel'),
        projectConfig.enableMultiBuild && [
          path.join(__dirname, '../plugins/babel/BabelPluginMultiTarget.js'),
          { target: TARGET, context: cwd, alias: genAlias(cwd) },
        ],
      ].filter(Boolean),
    });
  jsRule
    .use('ttComponentLoader')
    .loader(path.resolve(__dirname, '../loaders/ImportCustomComponentLoader'))
    .options({ target: TARGET });
}
function createCssRule(webpackConfig: Config, configHelper: ConfigHelper) {
  const cssRule = webpackConfig.module.rule('css').test(/\.(c|le)ss$/i);

  createRule(cssRule);

  function createRule(styleRule: Config.Rule<Config.Module>) {
    styleRule.use('style-loader').when(
      configHelper.isDev,
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
    styleRule
      .use('postcss-loader')
      .loader(require.resolve('postcss-loader'))
      .options({
        postcssOptions: {
          plugins: [
            require.resolve('postcss-import'),
            [
              path.join(__dirname, '../plugins/postcss/PostcssPreSelector.js'),
              { selector: `#${configHelper.buildId}` },
            ],
          ],
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
