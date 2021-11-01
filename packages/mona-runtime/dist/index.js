"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlugin = exports.createPageConfig = exports.createAppConfig = exports.createProjectConfig = void 0;
var createProjectConfig_1 = require("./createProjectConfig");
Object.defineProperty(exports, "createProjectConfig", { enumerable: true, get: function () { return createProjectConfig_1.createProjectConfig; } });
var createAppConfig_1 = require("./createAppConfig");
Object.defineProperty(exports, "createAppConfig", { enumerable: true, get: function () { return createAppConfig_1.createAppConfig; } });
var createPageConfig_1 = require("./createPageConfig");
Object.defineProperty(exports, "createPageConfig", { enumerable: true, get: function () { return createPageConfig_1.createPageConfig; } });
var createPlugin_1 = require("./createPlugin");
Object.defineProperty(exports, "createPlugin", { enumerable: true, get: function () { return createPlugin_1.createPlugin; } });
__exportStar(require("./components"), exports);
__exportStar(require("./apis"), exports);
//# sourceMappingURL=index.js.map