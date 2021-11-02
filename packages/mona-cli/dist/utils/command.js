"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchCommand = exports.joinCmdPath = exports.getGlobalInstallPkgMan = exports.commandUsage = void 0;
var path_1 = __importDefault(require("path"));
var pkg_dir_1 = __importDefault(require("pkg-dir"));
var child_process_1 = __importStar(require("child_process"));
var commandLineUsage = require('command-line-usage');
var commandUsage = function (cmds) {
    var content = cmds.map(function (cmd) { return ({ name: cmd.name, summary: cmd.description }); });
    content.push({ name: 'update', summary: '更新CLI到最新版本' });
    var sections = [
        {
            header: '描述',
            content: '商家应用开发和构建工具',
        },
        {
            header: '可选项',
            optionList: [
                { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
                { name: 'version', description: '输出当前CLI版本', alias: 'v', type: Boolean },
            ],
        },
        {
            header: '命令',
            content: content,
        },
    ];
    return commandLineUsage(sections);
};
exports.commandUsage = commandUsage;
// 判断是否有yarn
var _hasYarn = null;
function hasYarn() {
    if (_hasYarn !== null) {
        return _hasYarn;
    }
    try {
        (0, child_process_1.execSync)('yarn --version', { stdio: 'ignore' });
        return (_hasYarn = true);
    }
    catch (e) {
        return (_hasYarn = false);
    }
}
var _pkgMan;
function getGlobalInstallPkgMan() {
    if (_pkgMan !== null) {
        return _pkgMan;
    }
    if (hasYarn()) {
        var yarnGlobalDir = (0, child_process_1.execSync)('yarn global dir').toString().split('\n')[0];
        if (__dirname.includes(yarnGlobalDir)) {
            return (_pkgMan = 'yarn');
        }
    }
    var npmGlobalPrefix = (0, child_process_1.execSync)('npm config get prefix').toString().split('\n')[0];
    if (__dirname.includes(npmGlobalPrefix)) {
        return (_pkgMan = 'npm');
    }
    return (_pkgMan = 'npm');
}
exports.getGlobalInstallPkgMan = getGlobalInstallPkgMan;
// 判断是否是全局安装
var _isGlobaInstalled = null;
function isGlobaInstalled() {
    if (_isGlobaInstalled !== null) {
        return _isGlobaInstalled;
    }
    if (hasYarn()) {
        var yarnGlobalDir = (0, child_process_1.execSync)('yarn global dir').toString().split('\n')[0];
        if (__dirname.includes(yarnGlobalDir)) {
            return (_isGlobaInstalled = true);
        }
    }
    var npmGlobalPrefix = (0, child_process_1.execSync)('npm config get prefix').toString().split('\n')[0];
    if (__dirname.includes(npmGlobalPrefix)) {
        return (_isGlobaInstalled = true);
    }
    return (_isGlobaInstalled = false);
}
// 获取全局模块
// let _globalModules: string[] = [];
// function getGlobalModules() {
//   if (_globalModules.length > 0) {
//     return _globalModules;
//   }
//   let globalModules: string[] = []
//   if (hasYarn()) {
//     const [yarnGlobalDir] = execSync('yarn global dir', { stdio: ['pipe', 'pipe', 'ignore'] })
//       .toString()
//       .split('\n');
//     const yarnGlobalModule = path.join(yarnGlobalDir, 'node_modules');
//     globalModules.push(yarnGlobalModule);
//   }
//   const [npmglobalModules] = execSync('npm root --global', { stdio: ['pipe', 'pipe', 'ignore'] })
//       .toString()
//       .split('\n');
//   globalModules.push(npmglobalModules);
//   globalModules.push(path.join(npmglobalModules, getPkgPublicName(), 'node_modules'))
//   return (_globalModules = globalModules);
// }
function joinCmdPath(cmd) {
    // TODO: ensure pkg exist
    if (isGlobaInstalled()) {
        // const globalModules = getGlobalModules();
        // for (let gm of globalModules) {
        //   const cmdPath = path.join(gm, cmd.package, cmd.cli);
        //   if (fs.existsSync(cmdPath)) {
        //     return cmdPath;
        //   }
        // }
        // throw new Error(`Could not find ${cmd.package} globally`)
        var pkgPath = pkg_dir_1.default.sync(require.resolve(cmd.package));
        return path_1.default.resolve(pkgPath, cmd.cli);
    }
    else {
        var pkgPath = pkg_dir_1.default.sync(require.resolve(cmd.package, { paths: [process.cwd()], }));
        return path_1.default.resolve(pkgPath, cmd.cli);
    }
}
exports.joinCmdPath = joinCmdPath;
function dispatchCommand(cliPath) {
    // 另启进程执行子命令
    var res = child_process_1.default.spawnSync('node', __spreadArray([cliPath], process.argv.slice(3), true), {
        cwd: process.cwd(),
        shell: true,
        stdio: 'inherit',
    });
    if (res.status !== 0) {
        process.exit(res.status);
    }
}
exports.dispatchCommand = dispatchCommand;
//# sourceMappingURL=command.js.map