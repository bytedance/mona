import commandLineUsage from 'command-line-usage';
import minimist from 'minimist';
import PluginContext from './PluginContext';
import log from './utils/log';
const pkg = require('../package.json');

export interface IPlugin {
  (ctx: PluginContext): void;
}

class Service {
  private _plugins: IPlugin[] = [];
  private _pluginContext: PluginContext;
  constructor(plugins: IPlugin[]) {
    this.init();

    this.addPlugins(plugins);

    this._pluginContext = new PluginContext();
  }

  addPlugins(plugins: IPlugin[]) {
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
    const argv = minimist(process.argv.slice(2), { alias: { h: 'help', v: 'version' } });
    const cmdName = argv._[0] as string;
    
    const cmd = pluginContext.getCommand(cmdName);
    if (!cmd) {
      if (argv.help || !cmdName) {
        console.log(commandLineUsage([{
          header: '描述',
          content: '商家应用/插件开发构建工具',
        },
        {
          header: '可选项',
          optionList: [
            { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
            { name: 'version', description: '查看当前CLI版本', alias: 'v', type: Boolean },
          ],
        },
        {
          header: '命令',
          content: pluginContext.getCommandsDesc()
        }]))
      } else if (argv.v) {
        console.log(`v${pkg.version}`)
      } else {
        log.error(`invalid command`);
      }
      return;
    }

    const alias: Record<string, string> = { h: 'help' };
    const options = cmd.options.options;

    options?.forEach(option => {
      if (option.alias) {
        alias[option.alias] = option.name;
      }
    });

    const cmdArgv = minimist(process.argv.slice(2), { alias, string: ['appid'] });

    // for build and start, pass builder to callback
    const shouldPassBuilder = cmdName === 'build' || cmdName === 'start';

    if (shouldPassBuilder && !cmdArgv.help) {
      const { target: targetName } = cmdArgv;
      // find target builder
      const target = pluginContext.getTarget(targetName);
      if (target) {
        target.runTarget();
        cmd.runCommand(cmdArgv, target.targetContext);
      } else {
        log.error(`invalid target -- ${targetName}`);
      }
    } else {
      cmd.runCommand(cmdArgv);
    }
  }
}

export default Service;
