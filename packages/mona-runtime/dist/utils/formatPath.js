"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPath = void 0;
function formatPath(url) {
    return /^\//.test(url) ? url.toLowerCase() : `/${url.toLowerCase()}`;
}
exports.formatPath = formatPath;
//# sourceMappingURL=formatPath.js.map