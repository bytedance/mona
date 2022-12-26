// @ts-nocheck
import type { IPlugin } from '@bytedance/mona-service';

const maxComponent: IPlugin = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.configureWebpack(() => {
      ctx.configHelper.projectConfig.chain = pre => pre;
      if (process.env.NODE_ENV === 'production') {
        return require('../config/webpack.prod').default(ctx.configHelper.projectConfig);
      }

      return require('yarn run build../config/webpack.dev').default(ctx.configHelper.projectConfig);
    });
  });
};

export default maxComponent;
