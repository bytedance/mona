const updater = require('pkg-updater');
import minimist from 'minimist';

import { IPlugin } from '../Service';
// max 提示isv 升级版本
const checkVersionPlugin: IPlugin = _ctx => {
  const cmdArgv = minimist(process.argv.slice(2), {});
  const { _: command, t } = cmdArgv;
  if (t !== 'max' && !['max-start', 'max-build'].includes(command[0])) {
    return;
  }
  const pkg = require('../../package.json');
  updater({
    pkg: pkg,
    registry: 'https://registry.npmjs.org', // custom registry
    tag: 'latest', // custom the check tag(default is latest)
    level: '',
    checkInterval: 24 * 60 * 60 * 1000, // custom the check interval(ms)
    updateMessage:
      'Package update available:' +
      '<%=colors.red(current)%> -> <%=colors.green(latest)%>' +
      '<%if(incompatible){%>\n<%=colors.bold("This version is incompatible, you should update before continuing.")%><%}%>\n' +
      'Run yarn add @bytedance/mona-service@latest / npm install @bytedance/mona-service@latest to update.',
  }).then(() => {});
};

module.exports = checkVersionPlugin;
