const transformRpx = (value: string) => {
  if (/rpx$/.test(value)) {
    const num = Number(value.replace(/rpx$/, ''));
    if (!Number.isNaN(num)) {
      return `${num / 2}px`;
    }
  }
  return value;
}

const snakeToCamel = (str: string) =>
  str.toLowerCase().replace(/([-][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
  );
function getPropertyName(key: string) {
  return snakeToCamel(key);
}

export const cssToReactStyle = (css?: ReactLynx.CSSProperties | string) => {
  // If object is given, return object (could be react style object mistakenly provided)
  if (typeof css === 'object') {
    return css;
  }

  // If falsy, then probably empty string or null, nothing to be done there
  if (!css) {
    return {};
  }

  // Only accepts strings
  if (typeof css !== 'string') {
    // TODO sentry
    console.error(`Unexpected type "${typeof css}" when expecting string, with value "${css}"`);
    return {};
  }

  const style: { [key: string]: string } = {};
  const rules = css.split(';');
  rules.forEach(rule => {
    let [key, value] = rule.split(':');

    if (key && value) {
      key = key.trim();
      value = transformRpx(value.trim());

      style[getPropertyName(key)] = value;
    }
  })

  return style;
};