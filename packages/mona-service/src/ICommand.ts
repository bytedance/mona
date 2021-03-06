import minimist from 'minimist';
import commandLineUsage from 'command-line-usage';
import TargetContext from './TargetContext';
import ConfigHelper from './ConfigHelper';
import chalk from 'chalk';

export interface ICommandOptions {
  description?: string
  options?: { name: string, description: string, alias?: string }[]
  usage?: string
}

export interface ICommandCallback {
  (args: Record<string, any>, configHelper: ConfigHelper, targetContext?: TargetContext): void | Promise<void>
}

function isPromise(result: void | Promise<void>): result is Promise<void> {
  return typeof result?.then === 'function';
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

  runCommand(args: minimist.ParsedArgs, configHelper: ConfigHelper, targetContext?: TargetContext) {
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


    // print error
    try {
      const result = _fn.call(this, args, configHelper, targetContext);
      if (isPromise(result)) {
        result.catch(err => {
          console.log(chalk.red(err.message));
        })
      }
    } catch(err: any) {
      console.log(chalk.red(err.message));
    }
  }
}

export default ICommand;