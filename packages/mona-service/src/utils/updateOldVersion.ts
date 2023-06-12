import path from 'path';
import semver from 'semver';
import minimist from 'minimist';
const fs = require('fs');

import { IPlugin } from '@bytedance/mona-manager';

// max 提示isv 升级版本
const checkVersionPlugin: IPlugin = ctx => {
  try {
    const cmdArgv = minimist(process.argv.slice(2));
    const target = cmdArgv.t;
    if (target !== 'light') {
      return;
    }
    // const { cwd } = ctx.configHelper;
    // const staticDir = path.join(cwd, './package.json');
    // const pkg = require(staticDir);
    const currRuntimeVersion = require(require
      .resolve('@bytedance/mona-runtime')
      .replace('dist/index.js', 'package.json')).version;

    if (currRuntimeVersion) {
      const res = semver.compare('0.3.12', currRuntimeVersion);
      if (res !== -1) {
        const runtimePath = path.join(path.dirname(require.resolve('@bytedance/mona-client-web')), 'createWebApp.js');
        const readRes = fs.readFileSync(runtimePath, 'utf-8');
        const modText = readRes.toString().replace(`prefixCls: "mona"`, `prefixCls: "mui"`);
        fs.writeFileSync(runtimePath, modText);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = checkVersionPlugin;
