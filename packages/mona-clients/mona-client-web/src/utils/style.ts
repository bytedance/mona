import { CSSProperties } from 'react';

export function getStyleWithVendor(style: any): CSSProperties {
  const allowReg = /(transform|transition|animation)/i;
  const newStyle = Object.keys(style).reduce<any>((acc, key) => {
    const webkitStyle = allowReg.test(key)
      ? {
          [`Webkit${key.replace(/^(.)/, (_, p1) => p1.toUpperCase())}`]: style[key],
        }
      : {};
    return {
      ...acc,
      [key]: style[key],
      ...webkitStyle,
    };
  }, {});
  return newStyle;
}
