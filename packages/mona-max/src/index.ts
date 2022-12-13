const maxComponent = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.configureWebpack(() => {
      console.log(6666);
      ctx.configHelper.projectConfig.chain = pre => pre;
      if (process.env.NODE_ENV === 'production') {
        return require('../config/webpack.prod')(ctx.configHelper.projectConfig);
      }

      return require('../config/webpack.dev')(ctx.configHelper.projectConfig);
    });
  });
};

export default maxComponent;
