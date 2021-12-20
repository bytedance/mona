import { isObject, isFunction, isEventName } from '../../utils/utils';

describe('utils', () => {
  test('isObject', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(class T {})).toBe(false);
    expect(isObject(1)).toBe(false);
  });
  test('isFunction', () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(1)).toBe(false);
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(class T {})).toBe(true);
  });
  test('isEventName', () => {
    expect(isEventName('string')).toBe(false);
    expect(isEventName('bindTap')).toBe(false);
    expect(isEventName('o')).toBe(false);
    expect(isEventName('on')).toBe(true);
    expect(isEventName('onTap')).toBe(true);
  });
});
