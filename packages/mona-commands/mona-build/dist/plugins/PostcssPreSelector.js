"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const processed = Symbol('processed');
const reg = /(?:^|[ ]|,)(html|body)(?:$|[ ]|,)/;
module.exports = (opts) => {
    return {
        postcssPlugin: 'postcss-pre-selector',
        Rule(rule) {
            if (!rule[processed]) {
                const s = (opts === null || opts === void 0 ? void 0 : opts.selector) || '';
                rule.selector = `${s ? `${s} ` : ''}${rule.selector}`;
                rule[processed] = true;
                // replace html and body
                if (reg.test(rule.selector)) {
                    let selector = rule.selector;
                    const replace = (a) => a.replace(/(?:^|[ ]|,)(html|body)(?:$|[ ]|,)/, (s, s1) => s.replace(s1, `div[__marfishmock${s1}__]`));
                    while (reg.test(selector)) {
                        selector = replace(selector);
                    }
                    const newRule = rule.cloneAfter({ selector });
                    newRule[processed] = true;
                }
            }
        }
    };
};
module.exports.postcss = true;
//# sourceMappingURL=PostcssPreSelector.js.map