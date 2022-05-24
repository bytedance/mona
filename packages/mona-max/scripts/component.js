
import { execSync } from 'child_process';

const maxComponent = ctx => {
  ctx.registerCommand(
    'max-build',
    {
      description: '店铺装修组件打包',
      usage: 'mona-service max-build',
    },
    () => {
      execSync('cross-env NODE_ENV=production mona-service build -t max')
    }
  )
  ctx.registerCommand(
    'max-start',
    {
      description: '店铺装修组件本地开发',
      usage: 'mona-service max-start',
    },
    () => {
      execSync('cross-env NODE_ENV=development mona-service start -t max')
    }
  )
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
