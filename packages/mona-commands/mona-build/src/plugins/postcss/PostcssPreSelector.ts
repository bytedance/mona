// this is postcss plugin for create scoped css for mona plugin
import { Rule } from 'postcss';
const processed = Symbol('processed')

const reg = /(?:^|[ ]|,)(html|body)(?:$|[ ]|,)/;

module.exports = (opts?: { selector: string }) => {
  return {
    postcssPlugin: 'postcss-pre-selector',
    Rule (rule: Rule & { [index: symbol]: boolean }) {
      if (!rule[processed] && rule?.parent?.type !== 'atrule') {
        const s = opts?.selector || ''
        rule.selector = `${s ? `${s} ` : ''}${rule.selector}`;
        rule[processed] = true;

        // replace html and body
        if (reg.test(rule.selector)) {
          let selector = rule.selector
          const replace = (a: string) => a.replace(/(?:^|[ ]|,)(html|body)(?:$|[ ]|,)/, (s, s1) => s.replace(s1, `div[__marfishmock${s1}__]`))
          while (reg.test(selector)) {
            selector = replace(selector)
          }

          const newRule = rule.cloneAfter({ selector })
          newRule[processed] = true;
        }
      }
    }
  }
}

module.exports.postcss = true;