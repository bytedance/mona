import { CommandInfo } from '../cmds';
import path from 'path';
import pkgDir from 'pkg-dir';
import childProcess, { execSync } from 'child_process';

const commandLineUsage = require('command-line-usage');

export const commandUsage = (cmds: CommandInfo[]) => {
  const content = cmds.map(cmd => ({ name: cmd.name, summary: cmd.description }));
  content.push({ name: 'update', summary: '更新CLI到最新版本' });
  const sections = [
    {
      header: '描述',
      content: '商家应用开发和构建工具',
    },
    {
      header: '可选项',
      optionList: [
        { name: 'help', description: '输出帮助信息', alias: 'h', type: Boolean },
        { name: 'version', description: '输出当前CLI版本', alias: 'v', type: Boolean },
      ],
    },
    {
      header: '命令',
      content,
    },
  ];
  return commandLineUsage(sections);
};

// 判断是否有yarn
let _hasYarn: null | boolean = null;
function hasYarn() {
  if (_hasYarn !== null) {
    return _hasYarn;
  }

  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return (_hasYarn = true);
  } catch (e) {
    return (_hasYarn = false);
  }
}

// 判断是否是全局安装
let _isGlobaInstalled: null | boolean = null;
function isGlobaInstalled() {
  if (_isGlobaInstalled !== null) {
    return _isGlobaInstalled;
  }

  if (hasYarn()) {
    const [yarnGlobalDir] = execSync('yarn global dir').toString().split('\n');
    if (__dirname.includes(yarnGlobalDir)) {
      return (_isGlobaInstalled = true);
    }
  }

  const [npmGlobalPrefix] = execSync('npm config get prefix').toString().split('\n');
  if (__dirname.includes(npmGlobalPrefix)) {
    return (_isGlobaInstalled = true);
  }

  return (_isGlobaInstalled = false);
}

// 获取全局模块
// let _globalModules: string[] = [];
// function getGlobalModules() {
//   if (_globalModules.length > 0) {
//     return _globalModules;
//   }

//   let globalModules: string[] = []
//   if (hasYarn()) {
//     const [yarnGlobalDir] = execSync('yarn global dir', { stdio: ['pipe', 'pipe', 'ignore'] })
//       .toString()
//       .split('\n');
//     const yarnGlobalModule = path.join(yarnGlobalDir, 'node_modules');
//     globalModules.push(yarnGlobalModule);
//   }
//   const [npmglobalModules] = execSync('npm root --global', { stdio: ['pipe', 'pipe', 'ignore'] })
//       .toString()
//       .split('\n');
//   globalModules.push(npmglobalModules);
//   globalModules.push(path.join(npmglobalModules, getPkgPublicName(), 'node_modules'))

//   return (_globalModules = globalModules);
// }

export function joinCmdPath(cmd: CommandInfo) {
  // TODO: ensure pkg exist
  if (isGlobaInstalled()) {
    // const globalModules = getGlobalModules();
    // for (let gm of globalModules) {
    //   const cmdPath = path.join(gm, cmd.package, cmd.cli);
    //   if (fs.existsSync(cmdPath)) {
    //     return cmdPath;
    //   }
    // }
    // throw new Error(`Could not find ${cmd.package} globally`)
    const pkgPath = pkgDir.sync(require.resolve(cmd.package))!;
    return path.resolve(pkgPath, cmd.cli);
  } else {
    const pkgPath = pkgDir.sync(require.resolve(cmd.package, { paths: [process.cwd()],  }))!;
    return path.resolve(pkgPath, cmd.cli);
  }
}

export function dispatchCommand(cliPath: string) {
  // 另启进程执行子命令
  const res = childProcess.spawnSync('node', [cliPath, ...process.argv.slice(3)], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit',
  });

  if (res.status !== 0) {
    process.exit(res.status!);
  }
}
