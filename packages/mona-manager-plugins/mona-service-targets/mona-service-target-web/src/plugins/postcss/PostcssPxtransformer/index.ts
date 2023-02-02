// base on https://github.com/cuth/postcss-pxtorem

// (MIT License)

// Copyright (C) 2014 Jonathan Cuthbert <jon@cuth.net>

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

interface PxTransformerOptions {
  designWidth: number;
  deviceRatio: { [key: string]: number };
  platform: 'mini' | 'web';
  rootValue: number | ((input: any) => number);
  unitPrecision: number;
  selectorBlackList: (string | RegExp)[];
  replace: boolean;
  mediaQuery: boolean;
  minPixelValue: number;
  propList: string[];
  exclude: RegExp | null | ((name: string) => boolean);
}

const pxRegex = require('./lib/pixel-unit-regex');
const filterPropList = require('./lib/filter-prop-list');
const type = require('./lib/type');

const deviceRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2,
};

const defaults: PxTransformerOptions = {
  rootValue: 16,
  unitPrecision: 5,
  selectorBlackList: [],
  propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
  exclude: null,
  platform: 'mini',
  designWidth: 750,
  deviceRatio,
};

function createPxReplace(rootValue: number, unitPrecision: number, minPixelValue: number, unit: string) {
  return (m: string, $1: string) => {
    if (!$1) return m;
    const pixels = parseFloat($1);
    if (pixels < minPixelValue) return m;
    const fixedVal = toFixed(pixels / rootValue, unitPrecision);
    return fixedVal === 0 ? '0' : fixedVal + unit;
  };
}

function toFixed(number: number, precision: number) {
  const multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

function declarationExists(decls: any[], prop: string, value: string) {
  return decls.some(decl => decl.prop === prop && decl.value === value);
}

function blacklistedSelector(blacklist: PxTransformerOptions['selectorBlackList'], selector: string) {
  if (typeof selector !== 'string') return;
  return blacklist.some(regex => {
    if (typeof regex === 'string') {
      return selector.indexOf(regex) !== -1;
    }
    return selector.match(regex);
  });
}

function createPropListMatcher(propList: string[]) {
  const hasWild = propList.indexOf('*') > -1;
  const matchAll = hasWild && propList.length === 1;
  const lists = {
    exact: filterPropList.exact(propList),
    contain: filterPropList.contain(propList),
    startWith: filterPropList.startWith(propList),
    endWith: filterPropList.endWith(propList),
    notExact: filterPropList.notExact(propList),
    notContain: filterPropList.notContain(propList),
    notStartWith: filterPropList.notStartWith(propList),
    notEndWith: filterPropList.notEndWith(propList),
  };
  return (prop: string) => {
    if (matchAll) return true;
    return (
      (hasWild ||
        lists.exact.indexOf(prop) > -1 ||
        lists.contain.some(function (m: string) {
          return prop.indexOf(m) > -1;
        }) ||
        lists.startWith.some(function (m: string) {
          return prop.indexOf(m) === 0;
        }) ||
        lists.endWith.some(function (m: string) {
          return prop.indexOf(m) === prop.length - m.length;
        })) &&
      !(
        lists.notExact.indexOf(prop) > -1 ||
        lists.notContain.some(function (m: string) {
          return prop.indexOf(m) > -1;
        }) ||
        lists.notStartWith.some(function (m: string) {
          return prop.indexOf(m) === 0;
        }) ||
        lists.notEndWith.some(function (m: string) {
          return prop.indexOf(m) === prop.length - m.length;
        })
      )
    );
  };
}

const baseFontSize = 75;

let targetUnit: string = 'rpx';

module.exports = (options: Partial<PxTransformerOptions> = {}) => {
  const opts: PxTransformerOptions = Object.assign({}, defaults, options);

  switch (opts.platform) {
    case 'web': {
      opts.rootValue = options.rootValue || baseFontSize * opts.deviceRatio[opts.designWidth];
      targetUnit = 'rem';
      break;
    }
    default: {
      opts.rootValue = 1 / opts.deviceRatio[opts.designWidth];
    }
  }

  const satisfyPropList = createPropListMatcher(opts.propList);
  const exclude = opts.exclude;
  let isExcludeFile = false;
  let pxReplace: ReturnType<typeof createPxReplace>;
  return {
    postcssPlugin: 'postcss-pxtransform',
    Once(css: any) {
      const filePath = css.source.input.file;
      if (
        exclude &&
        ((type.isFunction(exclude) && (exclude as any)(filePath)) ||
          (type.isString(exclude) && filePath.indexOf(exclude) !== -1) ||
          filePath.match(exclude) !== null)
      ) {
        isExcludeFile = true;
      } else {
        isExcludeFile = false;
      }

      const rootValue = typeof opts.rootValue === 'function' ? opts.rootValue(css.source.input) : opts.rootValue;
      pxReplace = createPxReplace(rootValue, opts.unitPrecision, opts.minPixelValue, targetUnit);
    },
    Declaration(decl: any) {
      if (isExcludeFile) return;

      if (
        decl.value.indexOf('px') === -1 ||
        !satisfyPropList(decl.prop) ||
        blacklistedSelector(opts.selectorBlackList, decl.parent.selector)
      )
        return;
      const value = decl.value.replace(pxRegex, pxReplace);
      // if rem unit already exists, do not add or replace
      if (declarationExists(decl.parent, decl.prop, value)) return;

      if (opts.replace) {
        decl.value = value;
      } else {
        decl.cloneAfter({ value: value });
      }
    },
    AtRule(atRule: any) {
      if (isExcludeFile) return;

      if (opts.mediaQuery && atRule.name === 'media') {
        if (atRule.params.indexOf('px') === -1) return;
        atRule.params = atRule.params.replace(pxRegex, pxReplace);
      }
    },
  };
};
module.exports.postcss = true;
