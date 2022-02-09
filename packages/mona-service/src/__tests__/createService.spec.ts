import Service from '../Service';
import fs from 'fs';
import * as shared from '@bytedance/mona-shared';
import { ITargetCallback } from '../ITarget';

describe("createService", () => {
  beforeEach(() => {
     jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
     jest.spyOn(shared, 'readConfig').mockImplementation(() => ({}));
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it("should create a new service", () => {
    const service = new Service([]);
    expect(service).not.toBeNull();
    expect(service.run).toBeInstanceOf(Function);
    expect(service.install).toBeInstanceOf(Function);
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
  it('should run target callback correctly', () => {
    process.argv = ['a', 'b', 'build', '-t', 'custom', '-p', '9000']
    const buildInPlugins = [
      '../commands/build',
    ].map(name => require(name));
    const buildFn = jest.fn()
    const callback: ITargetCallback = jest.fn(tctx => {
      tctx.buildFn = buildFn;
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
})