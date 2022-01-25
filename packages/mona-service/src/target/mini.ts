import { IPlugin }  from '../Service';

const mini: IPlugin = (ctx) => {
  ctx.registerTarget('mini', (tctx) => {
    tctx.chainWebpack(webpackConfig => {
      console.log(webpackConfig)
    })
  })
}

export default mini;