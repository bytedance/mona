const maxComponent = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.configureWebpack(() => {
      if (process.env.NODE_ENV === 'production') {
        return require('../config/webpack.prod')('umd');
      }

      return require('../config/webpack.dev')('umd');
    })
  });
};

module.exports = maxComponent;
