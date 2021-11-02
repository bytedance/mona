"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPkgVersion = exports.getPkgName = exports.getPkgPublicName = void 0;
var pkg = require('../../package.json');
var getPkgPublicName = function () { return pkg.name; };
exports.getPkgPublicName = getPkgPublicName;
var getPkgName = function () { return pkg.displayName; };
exports.getPkgName = getPkgName;
var getPkgVersion = function () { return pkg.version; };
exports.getPkgVersion = getPkgVersion;
//# sourceMappingURL=package.js.map