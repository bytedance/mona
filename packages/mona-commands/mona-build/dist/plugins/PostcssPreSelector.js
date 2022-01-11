"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const processed = Symbol('processed');
const reg = /(?:^|\s|,)(html|body)(?:$|\s|,)/;
const htmlReg = /(?:^|\s|,)(html)(?:$|\s|,)/;
module.exports = (opts) => {
    return {
        postcssPlugin: 'postcss-pre-selector',
        Rule(rule) {
            var _a;
            if (!rule[processed] && ((_a = rule === null || rule === void 0 ? void 0 : rule.parent) === null || _a === void 0 ? void 0 : _a.type) !== 'atrule') {
                const s = (opts === null || opts === void 0 ? void 0 : opts.selector) || '';
                const newSelector = rule.selector.split(',').map(i => !htmlReg.test(i) ? `${s ? `${s} ` : ''}${i}` : s).join(',');
                // add prefix to all rule except html
                rule.selector = newSelector;
                rule[processed] = true;
                // replace html and body
                if (reg.test(rule.selector)) {
                    const replace = (a) => a.replace(reg, (s, s1) => s.replace(s1, `div[__marfishmock${s1}__]`));
                    const selector = replace(rule.selector);
                    const newRule = rule.cloneAfter({ selector });
                    newRule[processed] = true;
                }
            }
        }
    };
};
module.exports.postcss = true;
//# sourceMappingURL=PostcssPreSelector.js.map