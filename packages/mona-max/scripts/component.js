
const child_process = require('child_process');

const maxComponent = ctx => {
  ctx.registerTarget('max', tctx => {
    tctx.configureWebpack(() => {
      if (process.env.NODE_ENV === 'production') {
        return require('../config/webpack.prod')('umd');
      }

      return require('../config/webpack.dev')('umd');
    })
  });
  ctx.registerCommand(
    'max-build',
    {
      description: '店铺装修组件打包',
      usage: 'mona-service max-build',
    },
    () => {
      child_process.execSync('cross-env NODE_ENV=production mona-service build -t max')
    }
  )
  ctx.registerCommand(
    'max-start',
    {
      description: '店铺装修组件本地开发',
      usage: 'mona-service max-start',
    },
    () => {
      child_process.execSync('cross-env NODE_ENV=development mona-service start -t max')
    }
  )
};

module.exports = maxComponent;
