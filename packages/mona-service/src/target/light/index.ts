import { Platform } from '../constants';
import { IPlugin } from '../../Service';
import { chainWebpack } from '../plugin';

const { LIGHT } = Platform;

const light: IPlugin = ctx => {
  const configHelper = ctx.configHelper;

  ctx.registerTarget(LIGHT, tctx => {
    tctx.chainWebpack(webpackConfig => {
      chainWebpack(configHelper, webpackConfig, LIGHT);
    });
  });
};

module.exports = light;
