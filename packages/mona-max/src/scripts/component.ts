// @ts-nocheck
import type { IPlugin } from '@bytedance/mona-service';

const maxComponent: IPlugin = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.configureWebpack(() => {
      ctx.configHelper.projectConfig.chain = pre => pre;
      if (process.env.NODE_ENV === 'production') {
        return require('../config/webpack.prod')(ctx.configHelper.projectConfig);
      }

      return require('../config/webpack.dev')(ctx.configHelper.projectConfig);
    });
  });
};

export default maxComponent;
