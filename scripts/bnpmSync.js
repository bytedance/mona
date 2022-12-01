const concurrently = require('concurrently');
const execa = require('execa');
const path = require('path');

const genCommand = pkgName => {
  return `npx @bytedance-dev/bnpm sync ${pkgName}`;
};
function getPkgNameList() {
  const res = execa.commandSync('lerna list --json');
  const list = JSON.parse(res.stdout);
  return list.map(l => l.name);
}
const nameList = getPkgNameList();
console.log(nameList, '同步至bnpm,loading');
const { result } = concurrently(
  nameList.map(n => genCommand(n)),
  {
    cwd: path.join(__dirname, '../'),
  },
);
// result.then(console.log, console.log);
