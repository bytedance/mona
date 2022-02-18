import Builder, { RawWebpackConfigFn, ChainWebpackConfigFn } from "./Builder";
import log from "./utils/log";
import ITarget, { ITargetCallback } from "./ITarget";
import GlobalPluginContext from "./GlobalPluginContext";

class PluginContext extends GlobalPluginContext {
  private _targetMap: Map<string, ITarget>
  builder: Builder;

  constructor() {
    super();
    this._targetMap = new Map();
    this.builder = new Builder();
  }

  get configHelper() {
    return this.builder.configHelper;
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