const maxComponent = ctx => {
  ctx.registerTarget('max', tctx => {

    tctx.configureWebpack(() => {
      if (process.env.NODE_ENV === 'production') {
        const umdConfig = require('../config/webpack.prod')('umd')
        return umdConfig;
      }

      return require('../config/webpack.dev')('umd');
    })
  });
};

module.exports = maxComponent;
