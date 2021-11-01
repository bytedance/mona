"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareVersion = exports.getNewestVersion = exports.getCurrentVersion = void 0;
const child_process_1 = require("child_process");
const package_1 = require("./package");
function getCurrentVersion() {
    return (0, package_1.getPkgVersion)();
}
exports.getCurrentVersion = getCurrentVersion;
function getNewestVersion() {
    let newestVersion = '0.0.0';
    try {
        const cmd = `npm show ${(0, package_1.getPkgPublicName)()} version`;
        newestVersion = (0, child_process_1.execSync)(cmd).toString().replace(/\s/, '');
    }
    catch (err) {
        // Do Nothing
    }
    return newestVersion;
}
exports.getNewestVersion = getNewestVersion;
function compareVersion(v1, v2) {
    if (!v1 || !v2) {
        return 0;
    }
    const arr1 = v1.split('.');
    const arr2 = v2.split('.');
    const maxLength = Math.max(arr1.length, arr2.length);
    for (let i = 0; i < maxLength; i++) {
        if (Number(arr1[i] || 0) > Number(arr2[i] || 0)) {
            return 1;
        }
        else if (Number(arr1[i]) < Number(arr2[i])) {
            return -1;
        }
    }
    return 0;
}
exports.compareVersion = compareVersion;
//# sourceMappingURL=version.js.map