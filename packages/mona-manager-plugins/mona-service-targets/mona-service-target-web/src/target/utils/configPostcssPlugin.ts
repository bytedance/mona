import Config from "webpack-chain"

function configPostcssPlugin(webpackConfig: Config, plugins: any[]) {
  ['css', 'less'].forEach(rule => {
    webpackConfig.module.rules.get(rule)
    .use('postcss-loader')
    .before('less-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      postcssOptions: {
        plugins
      }
    })
  })
}

export default configPostcssPlugin;