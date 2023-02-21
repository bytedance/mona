import Service from '../Service';
import fs from 'fs';
import * as shared from '@bytedance/mona-shared';
import { ITargetCallback } from '../ITarget';
import commandLineUsage from 'command-line-usage';
import log from '../utils/log';

describe("createService", () => {
  beforeEach(() => {
    const originFsExists = fs.existsSync.bind(fs);
    jest.spyOn(fs, 'existsSync').mockImplementation(name => /(mona|app)\.config$/.test(name as string) ? true : originFsExists(name));
    jest.spyOn(shared, 'readConfig').mockImplementation(() => ({}));
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it("should create a new service", () => {
    const service = new Service([]);
    expect(service).not.toBeUndefined()
    expect(service.run).toBeInstanceOf(Function);
    expect(service.install).toBeInstanceOf(Function);
  })
  it("should log error when run a unregister command", () => {
    const errorSpy = jest.spyOn(log, 'error');
    process.argv = ['a', 'b', 'test', '-t', 'hello'];
    const service = new Service([]);
    service.install();
    service.run();
    expect(errorSpy).toHaveBeenCalledWith('invalid command');
    jest.resetAllMocks();
  })
  it('should run command callback correctly', () => {
    process.argv = ['a', 'b', 'test', '-t', 'hello'];
    const callback = jest.fn();
    const service = new Service([(ctx) => {
      ctx.registerCommand('test', {
        options: [{
          name: 'target', description: '', alias: 't'
        }]
      }, (args) => {
        callback(args)
      })
    }])
    service.install();
    service.run();
    expect(callback).toHaveBeenCalled()
    expect(callback.mock.calls[0]).toEqual([{ t: 'hello', target: 'hello', _: ['test'] }])
  })
  it('should print help message correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log')

    process.argv = ['a', 'b', 'test', '-h'];
    const callback = jest.fn();
    const options = {
      description: 'custom command',
      options: [{
        name: 'target', description: '', alias: 't',
      }, {
        name: 'port', description: '', alias: 'p',
      }],
      usage: 'mona test'
    }
    const service = new Service([(ctx) => {
      ctx.registerCommand('test', options, (args) => {
        callback(args)
      })
    }])
    service.install();
    service.run();
    const message = commandLineUsage([{
      header: '描述',
      content: options.description || '暂无描述',
    }, {
      header: '可选项',
      optionList: options.options?.map(p => ({ ...p, type: Boolean  }))
    }, {
      header: '用法',
      content: options.usage || `mona-service ${name}`
    }])
    
    expect(callback).not.toHaveBeenCalled()
    
    expect(consoleSpy).toHaveBeenCalledWith(message)
    jest.restoreAllMocks()
  })
  it("should log error when run a unregister target", () => {
    const errorSpy = jest.spyOn(log, 'error');
    const buildInPlugins = [
      '../commands/build',
    ].map(name => require(name));
    process.argv = ['a', 'b', 'build', '-t', 'hello'];
    const service = new Service(buildInPlugins);
    service.install();
    service.run();
    expect(errorSpy).toHaveBeenCalledWith('invalid target -- hello');
    jest.resetAllMocks();
  })
  it('should run target callback correctly when use build', () => {
    process.argv = ['a', 'b', 'build', '-t', 'custom', '-p', '9000']
    const buildInPlugins = [
      '../commands/build',
    ].map(name => require(name));
    const buildFn = jest.fn()
    const callback: ITargetCallback = jest.fn(tctx => {
      tctx.overrideBuildCommand(buildFn)
      // test chainWebpack
      tctx.chainWebpack(config => {
        config.mode('production')
      })
      expect(tctx.builder.resolveWebpackConfig().mode).toBe('production')
      // test configureWebpack
      tctx.chainWebpack(config => {
        config.mode('development')
      })
       expect(tctx.builder.resolveWebpackConfig().mode).toBe('development')
    })
    const service = new Service(buildInPlugins)
    service.addPlugins([(ctx) => {
      ctx.registerTarget('custom', callback)
    }])

    service.install();
    service.run();
    expect(callback).toBeCalled();
    expect(buildFn).toBeCalled();
    expect(buildFn.mock.calls[0]).toEqual([{ _: ['build'], p: 9000, t: 'custom', target: 'custom' }]);
  })
  it('should run target callback correctly when use start', () => {
    process.argv = ['a', 'b', 'start', '-t', 'custom', '-p', '9000']
    const buildInPlugins = [
      '../commands/start',
    ].map(name => require(name));
    const buildFn = jest.fn()
    const callback: ITargetCallback = jest.fn(tctx => {
      tctx.overrideStartCommand(buildFn)
    })
    const service = new Service(buildInPlugins)
    service.addPlugins([(ctx) => {
      ctx.registerTarget('custom', callback)
    }])

    service.install();
    service.run();
    expect(callback).toBeCalled();
    expect(buildFn).toBeCalled();
    expect(buildFn.mock.calls[0]).toEqual([{ _: ['start'], p: 9000, port: 9000, t: 'custom', target: 'custom' }]);
  })
})