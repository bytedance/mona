"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caclProjectType = exports.processTemplates = exports.processTemplate = exports.fetchTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
const ora_1 = __importDefault(require("ora"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const file_1 = require("./file");
const TEMPLATE_SOURCE = 'github:bytedance/mona-templates#main';
const TEMPLATE_DIR = '.tpl';
const fetchTemplate = function (projectRoot, templateName) {
    return new Promise((resolve, reject) => {
        (0, file_1.makeDir)(projectRoot);
        const tplDest = path_1.default.join(projectRoot, TEMPLATE_DIR);
        (0, file_1.makeDir)(tplDest);
        const spinner = (0, ora_1.default)('拉取并生成最新模板...').start();
        (0, download_git_repo_1.default)(TEMPLATE_SOURCE, tplDest, {}, error => {
            if (error) {
                spinner.fail(chalk_1.default.red(`模板拉取失败, ${error.message}`));
                return reject(error);
            }
            else {
                try {
                    const moveCmd = `mv ${tplDest}/${templateName}/* ${projectRoot} && rm -rf ${tplDest}`;
                    (0, child_process_1.execSync)(moveCmd, { stdio: 'ignore' });
                    console.log('exec success');
                }
                catch (err) {
                    return reject(error);
                }
                spinner.color = 'green';
                spinner.succeed(chalk_1.default.grey('模板拉取成功！'));
                return resolve('success');
            }
        });
    });
};
exports.fetchTemplate = fetchTemplate;
function renameFile(filePath, { typescript, cssExt }) {
    const ext = path_1.default.extname(filePath);
    let newPath = filePath;
    if (/^\.[jt]sx$/.test(ext)) {
        newPath = filePath.replace(/\.[jt]sx$/, typescript ? '.tsx' : '.jsx');
    }
    else if (/^\.[jt]s$/.test(ext)) {
        newPath = filePath.replace(/\.[jt]s$/, typescript ? '.ts' : '.js');
    }
    else if (/^\.(c|le|sa|sc)ss$/.test(ext)) {
        newPath = filePath.replace(/\.(c|le|sa|sc)ss$/, `.${cssExt}`);
    }
    fs_1.default.renameSync(filePath, newPath);
    return newPath;
}
async function processTemplate(filePath, templateData) {
    // 判断文件是否应该存在, 不应该则直接删除
    // 如果不是ts则不应该存在tsconfig.json和d.ts文件
    if ((/\.d\.ts$/.test(filePath) || /tsconfig\.json$/.test(filePath)) && !templateData.typescript) {
        fs_1.default.unlinkSync(filePath);
        return;
    }
    // 判断文件是否是js/jsx/ts/tsx/css/less/sass/scss/json，如何是这些则要进行文件内容及后缀的处理
    let newFilePath = filePath;
    const spinner = (0, ora_1.default)(`创建文件： ${filePath}`);
    const ext = path_1.default.extname(filePath);
    if (/^\.[jt]sx?$/.test(ext) || /^\.(c|le|sa|sc)ss$/.test(ext) || ext === '.json') {
        // 修改内容
        const fileContent = await ejs_1.default.renderFile(filePath, {
            data: templateData,
        }, {
            async: true,
        });
        fs_1.default.writeFileSync(filePath, fileContent);
        // 修改后缀
        newFilePath = renameFile(filePath, {
            typescript: templateData.typescript,
            cssExt: templateData.cssExt,
        });
    }
    // 打印出来文件成功
    spinner.succeed(chalk_1.default.grey(`文件 ${newFilePath} 创建成功`));
}
exports.processTemplate = processTemplate;
async function processTemplates(dirPath, templateData) {
    const files = (0, file_1.readAllFiles)(dirPath);
    // 遍历文件 处理问题
    await Promise.all(files.map(file => processTemplate(file, templateData)));
    // 再次遍历，删除空文件夹
    (0, file_1.removeEmptyDirs)(dirPath);
}
exports.processTemplates = processTemplates;
function caclProjectType(templateType) {
    let res = 'web';
    switch (templateType) {
        case 'pc':
            res = ['web', 'desktop'];
            break;
        case 'mobile':
            res = ['miniapp', 'web'];
            break;
        case 'plugin':
            res = ['plugin'];
            break;
        case 'monorepo':
            res = ['monorepo'];
            break;
        default:
            res = ['web'];
            break;
    }
    return JSON.stringify(res);
}
exports.caclProjectType = caclProjectType;
//# sourceMappingURL=template.js.map