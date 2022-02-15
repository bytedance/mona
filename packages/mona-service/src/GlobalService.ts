import minimist from 'minimist';
import GlobalPluginContext from './GlobalPluginContext';
import log from './utils/log';

export interface IGlobalPlugin {
  (ctx: GlobalPluginContext): void;
}

class GlobalService {
  private _plugins: IGlobalPlugin[] = [];
  private _pluginContext: GlobalPluginContext;
  constructor(plugins: IGlobalPlugin[]) {
    this.init();

    this.addPlugins(plugins);

    this._pluginContext = new GlobalPluginContext();
  }

  addPlugins(plugins: IGlobalPlugin[]) {
    for (let i = 0; i < plugins.length; i++) {
      if (typeof plugins[i] === 'function') {
        this._plugins.push(plugins[i]);
      }
    }
  }

  // init NODE_ENV
  init() {
    if (process.env.NODE_ENV === undefined) {
      const cmdName = minimist(process.argv.slice(2))._[0] as string;
      if (cmdName === 'build') {
        process.env.NODE_ENV = 'production';
      } else {
        process.env.NODE_ENV = 'development';
      }
    }
  }

  install() {
    const plugins = this._plugins;
    // apply all plugins
    plugins.forEach(p => {
      p.call(this, this._pluginContext);
    });
  }

  run() {
    const pluginContext = this._pluginContext;
    const argv = minimist(process.argv.slice(2));
    const cmdName = argv._[0] as string;
    const cmd = pluginContext.getCommand(cmdName);
    if (!cmd) {
      log.error(`invalid command`);
      return;
    }

    const alias: Record<string, string> = { h: 'help' };
    const options = cmd.options.options;

    options?.forEach(option => {
      if (option.alias) {
        alias[option.alias] = option.name;
      }
    });

    const cmdArgv = minimist(process.argv.slice(2), { alias });
    cmd.runCommand(cmdArgv);
  }
}

export default GlobalService;
