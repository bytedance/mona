import ora from 'ora';
import compareVersion from 'compare-version';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { getGlobalInstallPkgMan } from './utils/common';
import { getPkgPublicName } from './utils/package';
import { getCurrentVersion, getNewestVersion } from './utils/version';

export default class PackageUpdater {
  private _incompatible: boolean = false;
  private _currentVersion: string;
  private _newestVersion: string;
  private _registry: string;
  private _pkg: any;

  constructor(registry?: string, pkg?: any) {
    this._registry = registry || 'https://registry.npmjs.org';
    this._currentVersion = getCurrentVersion(pkg);
    this._newestVersion = getNewestVersion(this._registry, pkg);
  }

  start() {
    this.check();
    this.update();
  }

  check() {
    this._incompatible = compareVersion(this._newestVersion, this._currentVersion) > 0;

    console.log(this.render());
  }

  update() {
    if (this._incompatible) {
      const spinner = ora(`升级到 v${this._newestVersion}...`).start();
      const installCmd = this.generateUpdateCmd(this._registry, this._pkg);

      try {
        execSync(installCmd, { stdio: 'ignore' }).toString();
        spinner.color = 'green';
        spinner.succeed(chalk.green(`${getPkgPublicName(this._pkg)} v${this._newestVersion} 更新成功`));
      } catch (e) {
        spinner.color = 'red';
        spinner.fail(
          chalk.red(
            `${getPkgPublicName(this._pkg)} v${this._newestVersion} 更新失败\n可手动执行 ${chalk.cyan(
              installCmd,
            )} 进行更新`,
          ),
        );
      }
    }
  }

  render() {
    return `
      版本检查: ${this._currentVersion} -> ${this._newestVersion}
      ${this._incompatible ? chalk.yellow('有新的版本可用！') : chalk.green('已是最新版本！')}
    `;
  }

  generateUpdateCmd(registry: string, pkg?: any) {
    const pkgMan = getGlobalInstallPkgMan();
    const cmd = pkgMan === 'yarn' ? `yarn global add` : 'npm install -g';
    return `${cmd} ${getPkgPublicName(pkg)}@${this._newestVersion} --registry=${registry}`;
  }
}
