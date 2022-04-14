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
  const originBranchBehind = getDiff(branch, `origin/${branch}`);

  if (originBranchBehind) {
    return `落后${`origin/${branch}`}分支`;
  }

  const mainBehind = getDiff(branch);
  if (mainBehind) {
    return `落后${`origin/${mainBranch}`}分支`;
  }

  return '';
}



module.exports = {
  checkBranchBehind,
  getCommitDiff,
  getGitBranch,
};
