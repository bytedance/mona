// this is postcss plugin for create scoped css for mona plugin
import { Rule } from 'postcss';

module.exports = () => {
  return {
    postcssPlugin: 'mona-ui-prefix',
    Rule(rule: Rule & { [index: symbol]: boolean }) {
      if (rule.selector) {
        if (rule.selector.includes('auxo-')) {
          rule.selector = rule.selector.replace(new RegExp('auxo-', 'g'), 'mui-');
        } else if (rule.selector.includes('mona-')) {
          rule.selector = rule.selector.replace(new RegExp('mona-', 'g'), 'mui-');
        }
      }
    },
  };
};

module.exports.postcss = true;
