"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJavascriptFile = exports.readTypescriptFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function readTypescriptFile(filename) {
    require('@babel/register')({
        presets: [
            [require.resolve('@babel/preset-env'), { modules: 'commonjs' }],
            require.resolve('@babel/preset-typescript'),
        ],
        extensions: ['.ts', '.tsx'],
        cache: false,
    });
    delete require.cache[require.resolve(filename)];
    const config = require(filename).default || require(filename);
    return config;
}
exports.readTypescriptFile = readTypescriptFile;
function readJavascriptFile(filename) {
    require('@babel/register')({
        presets: [
            [require.resolve('@babel/preset-env'), { modules: 'commonjs' }],
        ],
        extensions: ['.js', 'jsx'],
        cache: false,
    });
    delete require.cache[require.resolve(filename)];
    const config = require(filename).default || require(filename);
    return config;
}
exports.readJavascriptFile = readJavascriptFile;
function readConfig(filename) {
    let cookedFilename = filename;
    const rawExt = path_1.default.extname(filename);
    if (['ts', 'js'].indexOf(rawExt) === -1) {
        for (const ext of ['ts', 'js']) {
            if (fs_1.default.existsSync(`${filename}.${ext}`)) {
                cookedFilename = `${filename}.${ext}`;
                break;
            }
        }
    }
    if (!fs_1.default.existsSync(cookedFilename)) {
        return {};
    }
    return path_1.default.extname(cookedFilename) === '.ts'
        ? readTypescriptFile(cookedFilename)
        : readJavascriptFile(cookedFilename);
}
exports.default = readConfig;
//# sourceMappingURL=readConfig.js.map