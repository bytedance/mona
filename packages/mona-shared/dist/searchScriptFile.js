"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function searchScriptFile(filename) {
    for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
        const fullFilename = `${filename}${ext}`;
        if (fs_1.default.existsSync(fullFilename)) {
            return fullFilename;
        }
    }
    return filename;
}
exports.default = searchScriptFile;
//# sourceMappingURL=searchScriptFile.js.map