"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.open = exports.redirectTo = exports.navigateTo = void 0;
const formatPath_1 = require("../utils/formatPath");
function navigateTo(url) {
    // @ts-ignore
    const _history = window.__mona_history;
    if (_history) {
        _history.push((0, formatPath_1.formatPath)(url));
    }
}
exports.navigateTo = navigateTo;
function redirectTo(url) {
    // @ts-ignore
    const _history = window.__mona_history;
    if (_history) {
        _history.replace((0, formatPath_1.formatPath)(url));
    }
}
exports.redirectTo = redirectTo;
function open(url) {
    window.open((0, formatPath_1.formatPath)(url));
}
exports.open = open;
//# sourceMappingURL=router.js.map