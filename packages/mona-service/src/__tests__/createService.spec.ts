import Service from '../Service';
import fs from 'fs';
import * as shared from '@bytedance/mona-shared';

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

  it("should add and run plugin correctly", () => {
    const p1 = jest.fn()
    const p2 = jest.fn()
    const service = new Service([p1])
    service.addPlugins([p2])

    service.install();
    service.run();

    expect(p1).toBeCalled();
    expect(p2).toBeCalled();
  })
  it('should run command correctly', () => {
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
})