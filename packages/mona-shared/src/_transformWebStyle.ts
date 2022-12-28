const RPX_VALUE_REG = /rpx$/
const ROOT_FONT_SIZE_PX = 100;

const transformRpxToRem = (origin: string) => {
  if (RPX_VALUE_REG.test(origin)) {
    const num = Number(origin.replace(RPX_VALUE_REG, ''));
    if (!Number.isNaN(num)) {
      return `${num / ROOT_FONT_SIZE_PX / 2}rem`;
    }
  }
  return origin;
}

export const _transformWebStyle = (style?: Record<string, any>) => {
  if (!style || typeof style !== 'object') {
    return style;
  }
  const result: Record<string, any> = {};
  Object.keys(style).forEach(styleKey => {
    result[styleKey] = transformRpxToRem(style[styleKey])
  })

  return result;
}