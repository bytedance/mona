import Builder, { RawWebpackConfigFn, ChainWebpackConfigFn } from "./Builder";
import ICommand, { ICommandCallback, ICommandOptions } from "./ICommand";
import log from "./utils/log";
// import TargetContext from './TargetContext';
import ITarget, { ITargetCallback } from "./ITarget";

class PluginContext {
  private _commandMap: Map<string, ICommand>
  private _targetMap: Map<string, ITarget>
  builder: Builder;

  constructor() {
    this._commandMap = new Map();
    this._targetMap = new Map();
    this.builder = new Builder();
  }

  registerCommand(name: string, options: ICommandOptions, fn: ICommandCallback) {
    const cmd = new ICommand(name, options, fn);
    if (this._commandMap.has(name)) {
      log.error(`the command name <${name}> has already been registered`);
      return;
    }
    this._commandMap.set(name, cmd);
  }

  registerTarget(targetName: string, fn: ITargetCallback) {
    const target = new ITarget(targetName, fn, this.builder);
    if (this._targetMap.has(targetName)) {
      log.error(`the target name <${targetName}> has already been registered`);
      return;
    }
    this._targetMap.set(targetName, target);
  }

  // chain webpack config
  chainWebpack(fn: ChainWebpackConfigFn) {
    this.builder.chainWebpackConfigFns.push(fn);
  }

  // merge webpack config
  configureWebpack(fn: RawWebpackConfigFn) {
    this.builder.rawWebpackConfigFns.push(fn);
  }

  getCommand(name: string): ICommand | null {
    const map = this._commandMap;
    return map.get(name) || null;
  }

  getTarget(targetName: string): ITarget | null {
    const map = this._targetMap;
    return map.get(targetName) || null;
  }
}

export default PluginContext