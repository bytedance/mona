import { isObject, isFunction, isEventName } from '../../utils/utils';

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
