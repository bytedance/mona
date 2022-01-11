"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPath = void 0;
function lowerCasePathName(name) {
    const [p, n] = name.split('?');
    return `${p.toLowerCase()}${n ? `?${n}` : ''}`;
}
function formatPath(url) {
    return lowerCasePathName(/^\//.test(url) ? url : `/${url}`);
}
exports.formatPath = formatPath;
//# sourceMappingURL=formatPath.js.map