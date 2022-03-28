import { IPlugin }  from '../Service'

const prod: IPlugin = (ctx) => {
  ctx.chainWebpack(webpackConfig => {
    if (process.env.NODE_ENV === 'production') {
      webpackConfig.mode('production').devtool(false)
    }
  })
}

module.exports = prod