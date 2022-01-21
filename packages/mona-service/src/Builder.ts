import merge from 'webpack-merge';
import { Configuration } from 'webpack';
import Config from 'webpack-chain';

export type RawWebpackConfigFn = Configuration | ((webpackConfig: Configuration) => Partial<Configuration> | void)
export type ChainWebpackConfigFn = (webpack: Config) => void;

class Builder {
  rawWebpackConfigFns: RawWebpackConfigFn[];
  chainWebpackConfigFns: ChainWebpackConfigFn[];

  constructor() {
    this.rawWebpackConfigFns = [];
    this.chainWebpackConfigFns = [];
  }

  resolveChainWebpackConfig () {
    const chainableConfig = new Config()
    this.chainWebpackConfigFns.forEach(fn => fn(chainableConfig))
    return chainableConfig
  }

  resolveWebpackConfig() {
    const chainableConfig = this.resolveChainWebpackConfig()
    let config = chainableConfig.toConfig() as Configuration
    this.rawWebpackConfigFns.forEach(fn => {
      if (typeof fn === 'function') {
        const res = fn(config) as Configuration
        if (res) config = merge(config, res)
      } else if (fn) {
        config = merge(config, fn)
      }
    })

    return config
  }

  clone() {
    const newBuilder = new Builder();
    newBuilder.chainWebpackConfigFns = [...this.chainWebpackConfigFns];
    newBuilder.rawWebpackConfigFns = [...this.rawWebpackConfigFns];
    return newBuilder;
  }
}

export default Builder