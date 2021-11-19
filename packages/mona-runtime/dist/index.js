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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlugin = exports.pigeon = void 0;
const mona_plugin_events_1 = __importDefault(require("@bytedance/mona-plugin-events"));
exports.pigeon = mona_plugin_events_1.default.pigeon;
var createPlugin_1 = require("./createPlugin");
Object.defineProperty(exports, "createPlugin", { enumerable: true, get: function () { return createPlugin_1.createPlugin; } });
__exportStar(require("./components"), exports);
__exportStar(require("./apis"), exports);
__exportStar(require("@bytedance/mona-client-mini"), exports);
//# sourceMappingURL=index.js.map