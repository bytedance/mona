import PluginContext from '../PluginContext'
import fs from 'fs'
import * as shared from '@bytedance/mona-shared';

describe('createPluginContext', () => {
  beforeEach(() => {
     jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
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
    expect(cmd).not.toBeNull();
  })
  it('should register a target correctly', () => {
    const ctx = new PluginContext();
    const targetFn = jest.fn()

    ctx.registerTarget('test', targetFn);
    const target = ctx.getTarget('test');
    expect(target).not.toBeNull();
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
    expect(ctx.builder.resolveWebpackConfig().mode).toBe('development')
    ctx.configureWebpack(config => ({ mode: 'production' }))
    expect(ctx.builder.resolveWebpackConfig().mode).toBe('production')
  })
})