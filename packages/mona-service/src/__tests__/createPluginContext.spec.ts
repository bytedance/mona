import PluginContext from '../PluginContext'
import fs from 'fs'
import * as shared from '@bytedance/mona-shared';
import log from '../utils/log';

describe('createPluginContext', () => {
  beforeEach(() => {
    const originFsExists = fs.existsSync.bind(fs);
    jest.spyOn(fs, 'existsSync').mockImplementation(name => /(mona|app)\.config$/.test(name as string) ? true : originFsExists(name));
    jest.spyOn(shared, 'readConfig').mockImplementation(() => ({}));
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should register a command correctly', () => {
    const ctx = new PluginContext();
    const cmdFn = jest.fn();

    ctx.registerCommand('test', {}, cmdFn);
    const cmd = ctx.getCommand('test');
    expect(ctx.configHelper).not.toBeUndefined()
    expect(cmd).not.toBeUndefined();
  })
  it('should log error when register command repeatly', () => {
    const errorSpy = jest.spyOn(log, 'error');
    const ctx = new PluginContext();
    const cmdFn = jest.fn();

    ctx.registerCommand('test', {}, cmdFn);
    ctx.registerCommand('test', {}, cmdFn);
    expect(errorSpy).toHaveBeenCalledWith(`the command name <test> has already been registered`)
    jest.resetAllMocks()
  })
  it('should register a target correctly', () => {
    const ctx = new PluginContext();
    const targetFn = jest.fn()

    ctx.registerTarget('test', targetFn);
    const target = ctx.getTarget('test');
    expect(target).not.toBeUndefined()
  })
   it('should log error when register target repeatly', () => {
    const errorSpy = jest.spyOn(log, 'error');
    const ctx = new PluginContext();
    const targetFn = jest.fn()

    ctx.registerTarget('test', targetFn);
    ctx.registerTarget('test', targetFn);
    expect(errorSpy).toHaveBeenCalledWith(`the target name <test> has already been registered`)
    jest.resetAllMocks()
  })
  it('should chain webpack config correctly', () => {
    const ctx = new PluginContext();
    ctx.chainWebpack(config => {
      config.mode('development')
    })
    expect(ctx.builder.resolveWebpackConfig().mode).toBe('development')
    ctx.chainWebpack(config => {
      config.mode('production')
    })
    expect(ctx.builder.resolveWebpackConfig().mode).toBe('production')
  })
  it('should merge webpack config correctly', () => {
    const ctx = new PluginContext();
    ctx.configureWebpack(config => {
      config.mode = 'development';
    })
    ctx.configureWebpack({
      devtool: 'source-map',
    })
    expect(ctx.builder.resolveWebpackConfig().mode).toBe('development')
    expect(ctx.builder.resolveWebpackConfig().devtool).toBe('source-map')
    ctx.configureWebpack(() => ({ mode: 'production' }))
    expect(ctx.builder.resolveWebpackConfig().mode).toBe('production')
  })
})