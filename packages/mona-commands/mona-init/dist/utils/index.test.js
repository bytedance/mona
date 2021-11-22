"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("./file");
const child_process_1 = require("child_process");
const common_1 = require("./common");
const template_1 = require("./template");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const PackageUpdater_1 = __importDefault(require("@bytedance/mona-cli/src/PackageUpdater"));
describe('file', () => {
    // const rootDir =
    let tempDir = `./monaJest${new Date().valueOf()}`;
    const rootDir = (0, path_1.join)(__dirname, '../');
    beforeEach(() => {
        tempDir = `./monaJest${new Date().valueOf()}`;
    });
    test('makeDir error', async () => {
        expect(() => (0, file_1.makeDir)(__dirname)).toThrow();
        expect(() => (0, file_1.makeDir)(tempDir)).not.toThrow();
        expect(() => (0, file_1.removeEmptyDirs)(tempDir)).not.toThrow();
    });
    test('removeEmptyDirs', async () => {
        // expect(() => removeEmptyDirs(tempDir)).toThrow();
        expect(() => (0, file_1.makeDir)(tempDir)).not.toThrow();
        expect(() => (0, file_1.makeDir)((0, path_1.join)(tempDir, `./monaJest${new Date().valueOf()}`))).not.toThrow();
        // 删除子文件夹
        expect(() => (0, file_1.removeEmptyDirs)(tempDir)).not.toThrow();
        // 删除根文件夹
        expect(() => (0, file_1.removeEmptyDirs)(tempDir)).not.toThrow();
    });
    test('readFileRecursive', async () => {
        var _a;
        // readFileRecursive(tempDir, files);
        expect(() => (0, file_1.readFileRecursive)(tempDir, [])).toThrow();
        //@ts-ignore
        expect(() => (0, file_1.readFileRecursive)(__dirname, {})).toThrow();
        const files = [];
        (0, file_1.readFileRecursive)(rootDir, files);
        expect(files.filter(item => item.includes(__dirname)).length > 0).toBe(true);
        expect(((_a = (0, file_1.readAllFiles)(rootDir)) === null || _a === void 0 ? void 0 : _a.length) > 0).toBe(true);
    });
});
describe('common', () => {
    test('common', async () => {
        expect(common_1.printWelcomeMessage).not.toThrow();
        expect(() => (0, common_1.printFinishMessage)('monaTest')).not.toThrow();
        expect(common_1.hasYarn).not.toThrow();
    });
});
describe('template', () => {
    let tempDir = `./monaJest${new Date().valueOf()}`;
    new PackageUpdater_1.default().start();
    test('fetchTemplate', async () => {
        expect(await catchError(() => (0, template_1.fetchTemplate)(tempDir, new Date().valueOf() + ''))).toBe(true);
        await fs_extra_1.default.remove(tempDir);
        expect(await catchError(() => (0, template_1.fetchTemplate)(tempDir, 'plugin'))).toBe(false);
        await fs_extra_1.default.remove(tempDir);
    });
    test('process Ts Templates', async () => {
        expect(await catchError(() => (0, template_1.fetchTemplate)(tempDir, 'plugin'))).toBe(false);
        // css测试浪费时间
        expect(await catchError(() => (0, template_1.processTemplates)(tempDir, {
            projectName: 'monaTest',
            cssExt: 'less',
            typescript: true
        }))).toBe(false);
    }, 100000);
    test('template Ts build', async () => {
        // 安装依赖
        const command = `npm i  --registry=https://registry.npmjs.org`;
        const build = `npm run build`;
        (0, child_process_1.execSync)(`cd ${tempDir} && ${command} && ${build}`, { stdio: 'ignore' });
        await fs_extra_1.default.remove(tempDir);
    }, 100000);
    test('process Js Templates', async () => {
        expect(await catchError(() => (0, template_1.fetchTemplate)(tempDir, 'plugin'))).toBe(false);
        expect(await catchError(() => (0, template_1.processTemplates)(tempDir, {
            projectName: 'monaTest',
            cssExt: 'less',
            typescript: false
        }))).toBe(false);
    }, 100000);
    test('template Js build', async () => {
        // 安装依赖
        const command = `npm i --registry=https://registry.npmjs.org`;
        const build = `npm run build`;
        (0, child_process_1.execSync)(`cd ${tempDir} && ${command} && ${build}`, { stdio: 'ignore' });
        await fs_extra_1.default.remove(tempDir);
    }, 100000);
});
const catchError = async (fn) => {
    let hasError = false;
    try {
        await fn();
        hasError = false;
    }
    catch (error) {
        console.log(error);
        hasError = true;
    }
    return hasError;
};
//# sourceMappingURL=index.test.js.map