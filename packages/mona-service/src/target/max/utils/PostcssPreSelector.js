// this is postcss plugin for create scoped css for mona plugin
const hexMD5 = require('./md5');
const processed = Symbol('processed');
const { uniqueHash } = require('./constants');
const reg = /(?:^|\s|,)(html|body)(?:$|\s|,)/;
const htmlReg = /(?:^|\s|,)(html)(?:$|\s|,)/;

module.exports = opts => {
  return {
    postcssPlugin: 'postcss-pre-selector',
    Rule(rule) {
      if (!rule[processed] && rule?.parent?.type !== 'atrule') {
        const s = opts?.selector || '';
        const newSelector = rule.selector
          .split(',')
          .map(item => {
            const itemWithHash = item
              .trim()
              .replace(/\s+/g, ' ')
              .split(' ')
              .map(i => {
                if (i.startsWith('.')) {
                  return i + '--' + uniqueHash;
                } else {
                  return i;
                }
              })
              .join(' ');
            return !htmlReg.test(item) ? `${s ? `${s} ` : ''}${itemWithHash}` : s;
          })
          .join(',');
        // add prefix to all rule except html
        rule.selector = newSelector;
        rule[processed] = true;

        // replace html and body
        if (reg.test(rule.selector)) {
          const replace = a => a.replace(reg, (s, s1) => s.replace(s1, `div[__marfishmock${s1}__]`));
          const selector = replace(rule.selector);
          const newRule = rule.cloneAfter({ selector });
          newRule[processed] = true;
        }
      }
    },
  };
};

module.exports.postcss = true;
