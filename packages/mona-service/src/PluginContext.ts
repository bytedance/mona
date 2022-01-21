import ICommand, { ICommandCallback, ICommandOptions } from "./ICommand";
import log from "./utils/log";

class PluginContext {
  private _commandMap: Map<string, ICommand>

  constructor() {
    this._commandMap = new Map();
  }

  registerCommand(name: string, options: ICommandOptions, fn: ICommandCallback) {
    const cmd = new ICommand(name, options, fn);
    if (this._commandMap.has(name)) {
      log.error(`the command name <${name}> has already been registered`);
    }
    this._commandMap.set(name, cmd);
  }

  registerTarget() {

  }

  getCommand(name: string): ICommand | null {
    const map = this._commandMap;
    return map.get(name) || null;
  }
}

export default PluginContext