"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.open = exports.redirectTo = exports.navigateTo = void 0;
const formatPath_1 = require("../utils/formatPath");
function navigateTo(url) {
    history.pushState({}, '', (0, formatPath_1.formatPath)(url));
}
exports.navigateTo = navigateTo;
function redirectTo(url) {
    window.location.href = (0, formatPath_1.formatPath)(url);
}
exports.redirectTo = redirectTo;
function open(url) {
    window.open((0, formatPath_1.formatPath)(url));
}
exports.open = open;
//# sourceMappingURL=router.js.map