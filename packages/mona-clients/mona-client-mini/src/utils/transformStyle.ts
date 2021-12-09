// 参考自remax
import React from 'react';

const isVendorPrefixes: Record<string, boolean> = {
  webkit: true,
  moz: true,
  ms: true,
  o: true,
};

const isPxToRpx = true;
const RPX = 'rpx';

const transformReactStyleKey = (key: string) => {
  // css3变量
  if (key.startsWith('--')) {
    return key;
  }

  let styleValue = key.replace(/\.?([A-Z]+)/g, function (_x, y) {
    return '-' + y.toLowerCase();
  });

  if (styleValue.startsWith('-')) {
    const firstWord = styleValue.split('-').filter(s => s)[0];
    styleValue = styleValue.replace(/^-/, '');
    if (isVendorPrefixes[firstWord]) {
      styleValue = '-' + styleValue;
    }
  }

  return styleValue;
};

const setPxToRpx = (value: string) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\b(\d+(\.\d+)?)px\b/g, function (_match, x) {
    const size = Number(x);
    return size % 1 === 0 ? `${size}${RPX}` : `${size.toFixed(2)}${RPX}`;
  });
};

// react style => miniapp style
export const plainStyle = (style: React.CSSProperties) => {
  return Object.keys(style)
    .reduce((res: string[], styleKey) => {
      let value = (style as any)[styleKey];

      if (!Number.isNaN(Number(value)) && !isUnitlessNumber[styleKey]) {
        value = `${value}${RPX}`;
      }

      return [...res, `${transformReactStyleKey(styleKey)}:${isPxToRpx ? setPxToRpx(value) : value};`];
    }, [])
    .join('');
};

export const isUnitlessNumber: Record<string, boolean> = {
  lineClamp: true,
  lineHeight: true,
  fontWeight: true,
  order: true,
  opacity: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  columns: true,
  columnCount: true,
  gridArea: true,
  gridRow: true,
  gridRowStart: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridColumn: true,
  gridColumnStart: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};
