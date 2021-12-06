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
    return size % 1 === 0 ? size + RPX : size.toFixed(2) + RPX;
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
