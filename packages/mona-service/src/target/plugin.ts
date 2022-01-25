import { IPlugin }  from '../Service';

const plugin: IPlugin = (ctx) => {
  ctx.registerTarget('plugin', () => {
    // todo
  })
}

export default plugin;