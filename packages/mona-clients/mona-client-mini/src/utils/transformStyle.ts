import React from 'react';


const RPX = 'rpx';
const PX = 'px';

export const transformReactStyleKey = (key: string) => {
  // css3
  if (key.startsWith('--')) {
    return key;
  }

  return key.replace(/\.?([A-Z]+)/g, (_, str) => '-' + str.toLowerCase()).replace(/^-/, '');
};

export const setPxToRpx = (value: string) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/\b(\d+(\.\d+)?)px\b/g, function (_match, x) {
    const size = Number(x);
    return size % 1 === 0 ? `${size}${RPX}` : `${size.toFixed(2)}${RPX}`;
  });
};

// react style => miniapp style
export const plainStyle = (style: React.CSSProperties, isPxToRpx: boolean = false) => {
  return Object.keys(style)
    .reduce((res: string[], styleKey) => {
      let value = (style as any)[styleKey];

      if (!Number.isNaN(Number(value)) && !unitlessNumberMap[styleKey]) {
        value = `${value}${PX}`;
      }

      return [...res, `${transformReactStyleKey(styleKey)}:${isPxToRpx ? setPxToRpx(value) : value};`];
    }, [])
    .join('');
};

export const unitlessNumberMap: Record<string, boolean> = {
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
