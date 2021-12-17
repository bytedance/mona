import { transformReactStyleKey, setPxToRpx, plainStyle } from '../../utils/transformStyle';

describe('transformStyle', () => {
  test('transformReactStyleKey', () => {
    expect(transformReactStyleKey('fontSize')).toBe('font-size');
    expect(transformReactStyleKey('--size')).toBe('--size');
    expect(transformReactStyleKey('font-size')).toBe('font-size');
  });
  test('setPxToRpx', () => {
    expect(setPxToRpx('1.66px')).toBe('1.66rpx');
    expect(setPxToRpx('1.66')).toBe('1.66');

    expect(setPxToRpx('1.66rpx')).toBe('1.66rpx');
  });

  test('plainStyle', () => {
    expect(plainStyle({ fontSize: '6.66' })).toBe('font-size:6.66px;');
    //@ts-ignore
    expect(plainStyle({ '--font': '6.66' })).toBe('--font:6.66px;');
    //@ts-ignore
    expect(plainStyle({ 'font-size': 1 })).toBe('font-size:1px;');
    //@ts-ignore
    expect(plainStyle({ 'font-size': '1' })).toBe('font-size:1px;');
    //@ts-ignore
    expect(plainStyle({ 'font-size': '6.66rpx' })).toBe('font-size:6.66rpx;');

    //@ts-ignore
    expect(plainStyle({ 'font-size': '6.66px' }, true)).toBe('font-size:6.66rpx;');
    //@ts-ignore
    expect(plainStyle({ 'font-size': '6.66' }, true)).toBe('font-size:6.66rpx;');
    //@ts-ignore
    expect(plainStyle({ 'font-size': '6.66rpx' }, true)).toBe('font-size:6.66rpx;');

    //@ts-ignore
    expect(plainStyle({ 'font-size': '6.66rpx', 'margin-left': 32.5, marginRight: 59 })).toBe(
      'font-size:6.66rpx;margin-left:32.5px;margin-right:59px;',
    );
  });
});
