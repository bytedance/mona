const execa = require('execa');
const semver = require('semver');
const chalk = require('chalk');
const inquirer = require('inquirer');

function getGitBranch() {
  const res = execa.commandSync('git rev-parse --abbrev-ref HEAD');
  return res.stdout;
}
function getPkgNpmVersionList() {
  let res = execa.commandSync('npm view @bytedance/mona versions --json');
  res = JSON.parse(res.stdout);
  if (Array.isArray(res) && res.length) {
    return res;
  } else {
    return [];
  }
}
function getPkgNpmVersion(list) {
  let res = list ? list : JSON.parse(execa.commandSync('npm view @bytedance/mona versions --json').stdout);
  if (Array.isArray(res) && res.length) {
    return res[res.length - 1];
  } else {
    return '0.0.0';
  }
}

function getVersion() {
  const res = require('../lerna.json');
  return res && res.version;
}
const tagReg = /(?<=(-)).*?(?=(\.))/g;

function getTag(str) {
  const tag = tagReg.exec(str || '');
  if (Array.isArray(tag)) {
    return tag[0];
  }
  return;
}
function log(...args) {
  console.log(chalk.white.bgBlack('release'), ...args);
}

const genPrompt = title => {
  const arr = [
    {
      type: 'confirm',
      name: 'release',
      message: title,
      default: true,
    },
  ];
  return arr;
};

function main() {
  log(chalk.bold.red(`发布注意事项:\n   1. 确定已经merge main分支。\n   2. 确保当前分支最新`));

  const newVersion = getVersion();
  const tag = getTag(newVersion);
  const npmVersionList = getPkgNpmVersionList();
  const npmVersion = getPkgNpmVersion(npmVersionList);

  const branch = getGitBranch();

  // const isValid = semver.valid(newVersion);
  const cmp = semver.compare(npmVersion, newVersion);
  const released = npmVersionList.includes(newVersion);
  log(chalk.green(`即将发布版本: ${chalk.blue.underline.bold(newVersion)}`));
  let oldVersion = false;
  if (cmp === 1) {
    if (released) {
      log(chalk.red(`版本<${newVersion}>已存在`));
      return;
    } else {
      log(chalk.red(`版本<${newVersion}>落后npm最新版本<${npmVersion}>`));
      oldVersion = true;
    }
  } else if (cmp === 0) {
    log(chalk.red(`版本<${newVersion}>已存在`));
    return;
  } else if (cmp === -1) {
    oldVersion = false;
  }
  inquirer
    .prompt(
      genPrompt(
        oldVersion
          ? `版本<${newVersion}>落后npm最新版本<${npmVersion}>, 确认要发npm包吗`
          : `版本<${newVersion}>, 确认发npm包吗`,
      ),
    )
    .then(ans => {
      if (ans.release) {
        execa.commandSync('git add .');
        execa.commandSync(`git commit -m \"chore(release): publish ${newVersion}  ${tag ? `--tag=${tag}` : ''}\"`, {
          shell: true,
        });
        execa.commandSync(`git push origin ${branch}`);
        log(chalk.green(`请到 ${chalk.blue.underline.bold('https://github.com/bytedance/mona/actions')} 观察流水线`));
      } else {
        log(chalk.red(`npm发包终止`));
        return;
      }
    });
}
main();
