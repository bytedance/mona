import minimist from 'minimist';
import PluginContext from "./PluginContext";
import log from "./utils/log";

export interface IPlugin {
  (ctx: PluginContext): void;
}

class Service {
  private _plugins: IPlugin[] = [];
  private _pluginContext: PluginContext;
  
  constructor(plugins: string[]) {
    this.addPlugins(plugins);
    this._pluginContext = new PluginContext();
  }

  addPlugins(plugins: string[]) {
    plugins.forEach(p => {
      const pluginPath = require.resolve(p);
      const result: IPlugin = require(pluginPath);
      this._plugins.push(result);
    })
  }

  install() {
    const plugins = this._plugins;

    // apply all plugins
    plugins.forEach(p => {
      p.call(this, this._pluginContext);
    })
  }

  run() {
    const argv = minimist(process.argv.slice(2));

    const pluginContext = this._pluginContext;
    const cmdName = argv._[0] as string;
    const cmd = pluginContext.getCommand(cmdName);
    if (!cmd) {
      log.error(`invalid command`);
      return;
    }
    
    // run cmd
    cmd.runCommand(argv);
  }
}

export default Service