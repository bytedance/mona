import minimist from 'minimist';
import PluginContext from "./PluginContext";
import log from "./utils/log";

export interface IPlugin {
  (ctx: PluginContext): void;
}

class Service {
  private _plugins: IPlugin[] = [];
  private _pluginContext: PluginContext;
  
  constructor(plugins: IPlugin[]) {
    this.addPlugins(plugins);
    this._pluginContext = new PluginContext();
  }

  addPlugins(plugins: IPlugin[]) {
    for (let i = 0; i < plugins.length; i++) {
      if (typeof plugins[i] === 'function') {
        this._plugins.push(plugins[i])
      }
    }
  }

  install() {
    const plugins = this._plugins;

    // apply all plugins
    plugins.forEach(p => {
      p.call(this, this._pluginContext);
    })
  }

  run() {
    const pluginContext = this._pluginContext;

    // run all command
    const argv = minimist(process.argv.slice(2));
    const cmdName = argv._[0] as string;
    const cmd = pluginContext.getCommand(cmdName);
    if (!cmd) {
      log.error(`invalid command`);
      return;
    }
    
    const alias: Record<string, string> = { h: 'help' };
    const options = cmd.options.options;
    options?.forEach((option => {
      if (option.alias) {
        alias[option.alias] = option.name
      }
    }))
    const cmdArgv = minimist(process.argv.slice(2), { alias });
    
    // for build and start, pass builder to callback
    const shouldPassBuilder = cmdName === 'build' || cmdName === 'start';
    if (shouldPassBuilder && !cmdArgv.help) {
      const { target: targetName } = cmdArgv;
      // find target builder
      const target = pluginContext.getTarget(targetName);
      if (target) {
        target.runTarget()
        cmd.runCommand(cmdArgv, target.targetContext)
      } else {
        log.error(`invalid target -- ${targetName}`);
      }
    } else {
      cmd.runCommand(cmdArgv);
    }
  }
}

export default Service