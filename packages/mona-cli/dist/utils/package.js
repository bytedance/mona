"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPkgVersion = exports.getPkgName = exports.getPkgPublicName = void 0;
const currentVersion_1 = __importDefault(require("../currentVersion"));
const getPkgPublicName = () => '@ecom/mona-cli';
exports.getPkgPublicName = getPkgPublicName;
const getPkgName = () => 'mona';
exports.getPkgName = getPkgName;
const getPkgVersion = () => currentVersion_1.default;
exports.getPkgVersion = getPkgVersion;
//# sourceMappingURL=package.js.map