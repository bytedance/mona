const { checkBranchBehind, getGitBranch } = require('./branch');
const inquirer = require('inquirer');
const branch = getGitBranch();

const branchBehindInfo = checkBranchBehind(branch);
if (branchBehindInfo) {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'behindBranch',
        message: `落后${branchBehindInfo}分支，是否要继续`,
        default: false,
      },
    ])
    .then(res => {
      if (!res.behindBranch) {
        process.exit(1);
      }
    });
}
