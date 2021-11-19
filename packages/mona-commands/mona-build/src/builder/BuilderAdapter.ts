import { Compiler } from 'webpack';
import { Options } from '@/index';
import { ConfigHelper } from '@/configHelper';
import MiniBuilder from './MiniBuilder';
import WebBuilder from './WebBuilder';
import PluginBuilder from './PluginBuilder';
import { DEFAULT_PORT } from '@/constants';
import BaseBuilder from './BaseBuilder';

class BuilderAdapter implements BaseBuilder {
  configHelper: ConfigHelper;
  compiler: Compiler;
  builder: BaseBuilder;
  
  constructor(options: Options) {
    const requiredOptions = { target: options.target || 'web', port: options.port || DEFAULT_PORT, dev: options.dev || false };
    const configHelper = new ConfigHelper(requiredOptions)

    const target = options.target || 'web';
    let builder: BaseBuilder;

    switch(target) {
      case 'mini':
        builder = new MiniBuilder(configHelper);
        break;
      case 'plugin':
        builder = new PluginBuilder(configHelper);
        break;
      case 'web':
      default:
        builder = new WebBuilder(configHelper);
        break;
    }

    this.builder = builder;
    this.configHelper = configHelper;
    this.compiler = builder.compiler;
  }

  build(): void {
    return this.builder.build();
  }

  start(): void {
    return this.builder.start();
  }
}

export default BuilderAdapter;