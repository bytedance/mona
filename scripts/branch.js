const execa = require('execa');

const mainBranch = 'main';

function getGitBranch() {
  const res = execa.commandSync('git rev-parse --abbrev-ref HEAD');
  return res.stdout;
}

// 检查branch1 是否落后branch2分支
function getCommitDiff(branch1, branch2 = `origin/${mainBranch}`) {
  const res = execa.commandSync(`git rev-list ${branch2} ^${branch1} --count `);
  return +res.stdout.trim() === 0 ? false : true;
}

function checkBranchBehind(branch) {
  const originBranchBehind = getCommitDiff(branch, `origin/${branch}`);

  if (originBranchBehind) {
    return `origin/${branch}`;
  }

  const mainBehind = getCommitDiff(branch);
  if (mainBehind) {
    return `origin/${mainBranch}`;
  }

  return '';
}


module.exports = {
  checkBranchBehind,
  getCommitDiff,
  getGitBranch,
};
