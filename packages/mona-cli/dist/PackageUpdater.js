"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ora_1 = __importDefault(require("ora"));
var compare_version_1 = __importDefault(require("compare-version"));
var child_process_1 = require("child_process");
var chalk_1 = __importDefault(require("chalk"));
var command_1 = require("./utils/command");
var package_1 = require("./utils/package");
var version_1 = require("./utils/version");
var PackageUpdater = /** @class */ (function () {
    function PackageUpdater() {
        this._incompatible = false;
        this._currentVersion = (0, version_1.getCurrentVersion)();
        this._newestVersion = (0, version_1.getNewestVersion)();
    }
    PackageUpdater.prototype.start = function () {
        this.check();
        this.update();
    };
    PackageUpdater.prototype.check = function () {
        this._incompatible = (0, compare_version_1.default)(this._newestVersion, this._currentVersion) > 0;
        console.log(this.render());
    };
    PackageUpdater.prototype.update = function () {
        if (this._incompatible) {
            var spinner = (0, ora_1.default)("\u5347\u7EA7\u5230 v".concat(this._newestVersion, "...")).start();
            var installCmd = this.generateUpdateCmd();
            try {
                (0, child_process_1.execSync)(installCmd, { stdio: 'ignore' }).toString();
                spinner.color = 'green';
                spinner.succeed(chalk_1.default.green("".concat((0, package_1.getPkgPublicName)(), " v").concat(this._newestVersion, " \u66F4\u65B0\u6210\u529F")));
            }
            catch (e) {
                spinner.color = 'red';
                spinner.fail(chalk_1.default.red("".concat((0, package_1.getPkgPublicName)(), " v").concat(this._newestVersion, " \u66F4\u65B0\u5931\u8D25\n\u53EF\u624B\u52A8\u6267\u884C ").concat(chalk_1.default.cyan(installCmd), " \u8FDB\u884C\u66F4\u65B0")));
            }
        }
    };
    PackageUpdater.prototype.render = function () {
        return "\n      \u7248\u672C\u68C0\u67E5: ".concat(this._currentVersion, " -> ").concat(this._newestVersion, "\n      ").concat((this._incompatible ? chalk_1.default.yellow('有新的版本可用！') : chalk_1.default.green('已是最新版本！')), "\n    ");
    };
    PackageUpdater.prototype.generateUpdateCmd = function () {
        var pkgMan = (0, command_1.getGlobalInstallPkgMan)();
        var cmd = pkgMan === 'yarn' ? "yarn global add" : 'npm install -g';
        return "".concat(cmd, " ").concat((0, package_1.getPkgPublicName)(), "@").concat(this._newestVersion);
    };
    return PackageUpdater;
}());
exports.default = PackageUpdater;
//# sourceMappingURL=PackageUpdater.js.map