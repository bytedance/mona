"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewestVersion = exports.getCurrentVersion = void 0;
var child_process_1 = require("child_process");
var package_1 = require("./package");
function getCurrentVersion() {
    return (0, package_1.getPkgVersion)();
}
exports.getCurrentVersion = getCurrentVersion;
function getNewestVersion() {
    var newestVersion = '0.0.0';
    try {
        var cmd = "npm view ".concat((0, package_1.getPkgPublicName)(), " version --registry=https://registry.npmjs.org");
        newestVersion = (0, child_process_1.execSync)(cmd).toString().replace(/\s/, '');
    }
    catch (err) {
        // Do Nothing
    }
    return newestVersion;
}
exports.getNewestVersion = getNewestVersion;
//# sourceMappingURL=version.js.map