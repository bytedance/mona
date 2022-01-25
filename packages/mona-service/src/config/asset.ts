import { IPlugin } from '../Service'

const asset: IPlugin = (ctx) => {
  ctx.configureWebpack(() => ({
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.svg$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/i,
          type: 'asset/resource'
        }
      ]
    }
  }))
}

module.exports = asset; 