import { CopyPublicPlugin, Platform } from '@bytedance/mona-manager-plugins-shared';
import { IPlugin } from '@bytedance/mona-manager';
import chain from '../utils/chain';
import path from 'path';
import configPostcssPlugin from '../utils/configPostcssPlugin';

const { PLUGIN } = Platform;

const plugin: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(PLUGIN, tctx => {
    tctx.chainWebpack(webpackConfig => {
      chain(webpackConfig, configHelper, PLUGIN);
      const { cwd, projectConfig } = configHelper;
      webpackConfig.output
        .libraryTarget('umd')
        .globalObject('window');
      webpackConfig.output.set('chunkLoadingGlobal', `webpackJsonp_${projectConfig.projectName}_${Date.now()}`);

      // TODO
      webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [
        configHelper,
        [
          {
            from: path.join(cwd, 'pigeon.json'),
            noErrorOnMissing: true,
          },
        ],
      ]);

      // styleRule
  //   .use('cssLoader')
  //   .loader(require.resolve('css-loader'))
  //   .options({
  //     importLoaders: 2,
  //     modules: {
  //       auto: true,
  //       localIdentName: '[local]_[hash:base64:5]',
        // getLocalIdent: (loaderContext: any, localIdentName: string, localName: string, options: any) => {
          // // 配合PostcssPreSelector插件
          // if (localName === configHelper.buildId) {
          //   return localName;
          // }

          // if (!options.context) {
          //   options.context = loaderContext.rootContext;
          // }

          // const request = path.relative(options.context, loaderContext.resourcePath).replace(/\\/g, '/');

          // options.content = `${options.hashPrefix + request}+${localName}`;

          // localIdentName = localIdentName.replace(/\[local\]/gi, localName);

          // const hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);

          // return hash;
        // },
    //   },
    // });
      // style
      configPostcssPlugin(webpackConfig, [
        require.resolve('@bytedance/mona-manager-plugins-shared/dist/plugins/postcss/PostcssPreSelector.js'),
        { selector: `#${configHelper.buildId}` },
      ])
    });
  });
};

module.exports = plugin;
