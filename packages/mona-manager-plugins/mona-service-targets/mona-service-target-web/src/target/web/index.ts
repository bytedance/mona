import { Platform } from '@bytedance/mona-manager-plugins-shared';
import { IPlugin } from '@bytedance/mona-manager';
import chain from '../utils/chain';

const { WEB } = Platform;

const web: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(WEB, tctx => {
    tctx.chainWebpack(webpackConfig => {
      chain(webpackConfig, configHelper, WEB);
    });
  });
};

module.exports = web;
