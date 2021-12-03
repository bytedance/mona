// 参考自remax
import React from 'react';

const vendorPrefixes = ['webkit', 'moz', 'ms', 'o'];
const isPxToRpx = true;
const transformReactStyleKey = (key: string) => {
  // css3变量
  if (key.startsWith('--')) {
    return key;
  }

  let styleValue = key.replace(/\.?([A-Z]+)/g, function (_x, y) {
    return '-' + y.toLowerCase();
  });

  // vendor prefix
  if (styleValue.startsWith('-')) {
    const firstWord = styleValue.split('-').filter(s => s)[0];
    styleValue = styleValue.replace(/^-/, '');
    if (vendorPrefixes.find(prefix => prefix === firstWord)) {
      styleValue = '-' + styleValue;
    }
  }

  return styleValue;
};

const transformPx = (value: string) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\b(\d+(\.\d+)?)px\b/g, function (_match, x) {
    const targetUnit = 'rpx';
    const size = Number(x);
    return size % 1 === 0 ? size + targetUnit : size.toFixed(2) + targetUnit;
  });
};

// react style => miniapp style
export const plainStyle = (style: React.CSSProperties) => {
  return Object.keys(style)
    .reduce((acc: string[], key) => {
      let value = (style as any)[key];

      if (!Number.isNaN(Number(value)) && !isUnitlessNumber[key]) {
        value = `${value}rpx`;
      }

      return [...acc, `${transformReactStyleKey(key)}:${isPxToRpx ? transformPx(value) : value};`];
    }, [])
    .join('');
};

export const isUnitlessNumber: { [key: string]: boolean } = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};
