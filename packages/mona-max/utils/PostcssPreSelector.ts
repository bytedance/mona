// this is postcss plugin for create scoped css for mona plugin
const processed = Symbol('processed');

const reg = /(?:^|\s|,)(html|body)(?:$|\s|,)/;
const htmlReg = /(?:^|\s|,)(html)(?:$|\s|,)/;

export default opts => {
  return {
    postcssPlugin: 'postcss-pre-selector',
    Rule(rule) {
      if (!rule[processed] && rule?.parent?.type !== 'atrule') {
        const s = opts?.selector || '';

        const newSelector = rule.selector
          .split(',')
          .map(i => (!htmlReg.test(i) ? `${s ? `${s} ` : ''}${i}` : s))
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
