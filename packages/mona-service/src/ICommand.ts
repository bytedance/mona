import minimist from 'minimist';
import commandLineUsage from 'command-line-usage';
import Builder from './builder';

export interface ICommandOptions {
  description?: string
  options?: { name: string, description: string, alias?: string }[]
  usage?: string
}

export interface ICommandCallback {
  (args: Record<string, any>, builder?: Builder): void | Promise<void>
}


class ICommand {
  name: string;
  options: ICommandOptions;
  private _fn: ICommandCallback;

  constructor(name: string, options: ICommandOptions, fn: ICommandCallback) {
    this.name = name;
    this.options = options;
    this._fn = fn;
  }

  runCommand(args: minimist.ParsedArgs, builder?: Builder) {
    const { options, _fn, name } = this;
    // if is help
    if (args.help) {
      console.log(commandLineUsage([{
        header: '描述',
        content: options.description || '暂无描述',
      }, {
        header: '可选项',
        optionList: options.options?.map(p => ({ ...p, type: Boolean  }))
      }, {
        header: '用法',
        content: options.usage || `mona-service ${name}`
      }]))
      return;
    }

    _fn.call(this, args, builder);
  }
}

export default ICommand;