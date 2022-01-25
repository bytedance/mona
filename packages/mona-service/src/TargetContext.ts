import Builder, { ChainWebpackConfigFn, RawWebpackConfigFn } from "./Builder";

class TargetContext {
  builder: Builder;
  
  constructor(builder: Builder) {
    this.builder = builder.clone();
  }

  // chain webpack config
  chainWebpack(fn: ChainWebpackConfigFn) {
    this.builder.chainWebpackConfigFns.push(fn);
  }

  // merge webpack config
  configureWebpack(fn: RawWebpackConfigFn) {
    this.builder.rawWebpackConfigFns.push(fn);
  }
}

export default TargetContext;