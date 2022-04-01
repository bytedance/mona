// lerna version 0.2.4  --exact --no-git-tag-version --force-publish --yes
// git add .
// `git commit -m "chore(release): publish ${newVersion} --tag=alpha`
// git push origin
// npm run lint
const execa = require('execa');
const semver = require('semver');
function getGitHash() {
  const res = execa.commandSync('git rev-parse --short HEAD');
  return res.stdout;
}

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
function main() {
  console.log('发布注意事项:\n 1. 确定已经merge main分支 2. 确保当前分支最新');
  // execa.commandSync('lerna version --exact --no-git-tag-version --force-publish --yes', { shell: true });
  // execa('lerna', ['version', '--exact', '--no-git-tag-version', '--force-publish', '--yes']).then(res => {
  //   console.log(res);
  // });
  const newVersion = getVersion();
  const tag = getTag(newVersion);
  const npmVersionList = getPkgNpmVersionList();
  const npmVersion = getPkgNpmVersion(npmVersionList);

  const branch = getGitBranch();

  const isValid = semver.valid(newVersion);
  const cmp = semver.compare(npmVersion, newVersion);
  const released = npmVersionList.includes(newVersion);
  console.log(`即将发布版本: ${newVersion}`);
  console.log(`Tag: ${tag}`);

  console.log(`当前分支: ${branch}`);
  console.log(`npmVersion: ${npmVersion}`);

  if (cmp === 1) {
    if (released) {
      console.log('即将发布版本已存在');
      return;
    } else {
      console.log('即将发布版本落后npm版本');
    }
  } else if (cmp === 0) {
    console.log('即将发布版本已存在');
    return;
  } else if (cmp === -1) {
    execa.commandSync('git add .');
    execa.commandSync(`git commit -m "chore(release): publish ${newVersion}  ${tag ? `--tag=${tag}` : ''}"`);
  }
}
main();
