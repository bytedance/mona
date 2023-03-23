import Builder, { RawWebpackConfigFn, ChainWebpackConfigFn } from "./Builder";
import ITarget, { ITargetCallback } from "./ITarget";
import ICommand, { ICommandCallback, ICommandOptions } from "./ICommand";
import log from "./utils/log";

class PluginContext {
  private _targetMap: Map<string, ITarget>
  private _commandMap: Map<string, ICommand>
  builder: Builder;

  constructor() {
    this._targetMap = new Map();
    this._commandMap = new Map();
    this.builder = new Builder();
  }

  get configHelper() {
    return this.builder.configHelper;
  }
  
  registerCommand(name: string, options: ICommandOptions, fn: ICommandCallback) {
    const cmd = new ICommand(name, options, fn);
    if (this._commandMap.has(name)) {
      log.error(`the command name <${name}> has already been registered`);
      return;
    }
    this._commandMap.set(name, cmd);
  }

  getCommand(name: string): ICommand | null {
    const map = this._commandMap;
    return map.get(name) || null;
  }

  getCommandsDesc() {
    return Array.from(this._commandMap.keys()).map(name => ({ name, summary: this._commandMap.get(name)?.options.description || '暂无描述' }))
  }

  registerTarget(targetName: string, fn: ITargetCallback) {
    if (!this.builder) {
      this.builder = new Builder();
    }
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

  getTarget(targetName: string): ITarget | null {
    const map = this._targetMap;
    return map.get(targetName) || null;
  }
}

export default PluginContext