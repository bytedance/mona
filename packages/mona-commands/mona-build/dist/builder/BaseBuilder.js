"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
class BaseBuilder {
    constructor(configHelper) {
        this.configHelper = configHelper;
        // generate webpack config
        const webpackConfig = this.configHelper.generate();
        // generate complier
        this.compiler = (0, webpack_1.default)(webpackConfig);
    }
}
exports.default = BaseBuilder;
//# sourceMappingURL=BaseBuilder.js.map