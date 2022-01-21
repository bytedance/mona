import minimist from 'minimist';
import commandLineUsage from 'command-line-usage';

export interface ICommandOptions {
  description?: string
  options?: { name: string, description: string, alias?: string }[]
  usage?: string
}

export interface ICommandCallback {
  (args: Record<string, any>): void | Promise<void>
}


class ICommand {
  name: string;
  private _options: ICommandOptions;
  private _fn: ICommandCallback;

  constructor(name: string, options: ICommandOptions, fn: ICommandCallback) {
    this.name = name;
    this._options = options;
    this._fn = fn;
  }

  runCommand(args: minimist.ParsedArgs) {
    const { _options, _fn, name } = this;
    // if is help
    if (args.help) {
      commandLineUsage([{
        header: '描述',
        content: _options.description || '暂无描述',
      }, {
        header: '可选项',
        optionList: _options.options
      }, {
        header: '用法',
        content: _options.usage || `mona-service ${name}`
      }])
      return;
    }

    _fn.call(this, args);
  }
}

export default ICommand;