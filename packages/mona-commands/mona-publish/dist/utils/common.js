"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressToZipFromDir = void 0;
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
const compressing_1 = __importDefault(require("compressing"));
async function compressToZipFromDir(destPath) {
    const spinner = (0, ora_1.default)('开始打包').start();
    const zipPath = path_1.default.resolve(destPath, '..', 'publish.zip');
    await compressing_1.default.zip.compressDir(destPath, zipPath);
    spinner.succeed(`打包成功：${zipPath}`);
    return zipPath;
}
exports.compressToZipFromDir = compressToZipFromDir;
//# sourceMappingURL=common.js.map