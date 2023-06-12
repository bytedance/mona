// this is postcss plugin for create scoped css for mona plugin
import { Rule } from 'postcss';

module.exports = () => {
  return {
    postcssPlugin: 'mona-ui-prefix',
    Rule(rule: Rule & { [index: symbol]: boolean }) {
      if (rule.selector) {
        if (rule.selector.includes('auxo-')) {
          rule.selector = rule.selector.replaceAll('auxo-', 'mui-');
        } else if (rule.selector.includes('mona-')) {
          rule.selector = rule.selector.replaceAll('mona-', 'mui-');
        }
      }
    },
  };
};

module.exports.postcss = true;
