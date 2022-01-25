import { IPlugin }  from '../Service';

const plugin: IPlugin = (ctx) => {
  ctx.registerTarget('plugin', (_tctx) => {
    // todo
  })
}

export default plugin;