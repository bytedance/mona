"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyDirs = exports.readAllFiles = exports.readFileRecursive = exports.makeDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const makeDir = (dirPath) => {
    if (fs_1.default.existsSync(dirPath) && fs_1.default.readdirSync(dirPath).length !== 0) {
        throw new Error('target directory is not empty!');
    }
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath);
    }
};
exports.makeDir = makeDir;
const readFileRecursive = (rootPath, files) => {
    fs_1.default.readdirSync(rootPath).forEach(fileName => {
        const filePath = path_1.default.join(rootPath, fileName);
        // 判断是否是文件夹
        if (fs_1.default.lstatSync(filePath).isDirectory()) {
            (0, exports.readFileRecursive)(filePath, files);
        }
        else {
            files.push(filePath);
        }
    });
};
exports.readFileRecursive = readFileRecursive;
const readAllFiles = (rootPath) => {
    const files = [];
    (0, exports.readFileRecursive)(rootPath, files);
    return files;
};
exports.readAllFiles = readAllFiles;
// 删除空文件夹
const removeEmptyDirs = (rootPath) => {
    const files = fs_1.default.readdirSync(rootPath);
    files.forEach(fileName => {
        const filePath = path_1.default.join(rootPath, fileName);
        // 判断是否是文件夹
        if (fs_1.default.lstatSync(filePath).isDirectory()) {
            (0, exports.removeEmptyDirs)(filePath);
        }
    });
    // 没有文件则删除
    if (files.length === 0) {
        fs_1.default.rmdirSync(rootPath);
    }
};
exports.removeEmptyDirs = removeEmptyDirs;
//# sourceMappingURL=file.js.map