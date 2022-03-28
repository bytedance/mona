import { isObject, isFunction, isEventName, monaPrint } from '../../utils/utils';

describe('utils', () => {
  test('isObject', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject(null)).toBeFalsy();
    expect(isObject(() => {})).toBeFalsy();
    expect(isObject(class T {})).toBeFalsy();
    expect(isObject(1)).toBeFalsy();
  });
  test('isFunction', () => {
    expect(isFunction({})).toBeFalsy();
    expect(isFunction(null)).toBeFalsy();
    expect(isFunction(1)).toBeFalsy();
    expect(isFunction(() => {})).toBeTruthy();
    expect(isFunction(function () {})).toBeTruthy();
    expect(isFunction(class T {})).toBeTruthy();
  });
  test('isEventName', () => {
    expect(isEventName('string')).toBeFalsy();
    expect(isEventName('bindTap')).toBeFalsy();
    expect(isEventName('o')).toBeFalsy();
    expect(isEventName('on')).toBeTruthy();
    expect(isEventName('onTap')).toBeTruthy();
  });
});

describe('monaPrint', () => {
  let originalLog: any;
  let originalWarn: any;
  let originalDebug: any;
  let ENV: any;

  beforeAll(() => {
    originalLog = global.console.log;
    originalWarn = global.console.warn;
    originalDebug = global.console.debug;
    global.console.log = jest.fn();
    global.console.warn = jest.fn();
    global.console.debug = jest.fn();

    ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = 'debug';
  });
  afterAll(() => {
    global.console.log = originalLog;
    global.console.warn = originalWarn;
    global.console.debug = originalDebug;
    process.env.NODE_ENV = ENV;
  });
  test('log', () => {
    monaPrint.log('测试ce');
    monaPrint.warn('测试ce');
    //@ts-ignore
    expect(global.console.log.mock.calls.length).toBe(1);
    //@ts-ignore
    expect(global.console.warn.mock.calls.length).toBe(1);
  });
  test('debug', () => {
    monaPrint.debug('测试');
    //@ts-ignore
    expect(global.console.debug.mock.calls.length).toBe(1);
    process.env.NODE_ENV = 'production';
    monaPrint.debug('测试2');
    //@ts-ignore
    expect(global.console.debug.mock.calls.length).toBe(1);
  });
});
