const updater = require('pkg-updater');

import { IPlugin } from '../Service';

// max 提示isv 升级版本
const checkVersionPlugin: IPlugin = _ctx => {
  const pkg = require('../../package.json');
  updater({
    pkg: pkg,
    registry: 'https://registry.npmjs.org',
    tag: 'latest',
    level: '',
    checkInterval: 24 * 60 * 60 * 1000,
    updateMessage:
      'Package update available:' +
      '<%=colors.red(current)%> -> <%=colors.green(latest)%>' +
      '<%if(incompatible){%>\n<%=colors.bold("This version is incompatible, you should update before continuing.")%><%}%>\n' +
      'Run npm install @bytedance/mona-service@latest to update.',
  }).then(() => {});
};

module.exports = checkVersionPlugin;
