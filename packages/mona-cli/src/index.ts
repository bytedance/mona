import { getPkgName, getPkgVersion } from './utils/package';
import chalk from 'chalk';
import yargs from 'yargs';
import cmds from './cmds';
import { commandUsage, dispatchCommand, joinCmdPath } from './utils/command';
import PackageUpdater from './PackageUpdater';
function mona() {
  // 检查新版本, 提示更新
  yargs.help(false).version(false);
  
  // 注册子命令，并匹配当前命令进行调用
  const currentCmd = yargs.argv._.slice(0)[0] as string;
  const currentCmdInfo = cmds.find(cmd => cmd.name === currentCmd);
  if (currentCmdInfo) {
    // TODO: handle option
    yargs.command(currentCmdInfo.name, currentCmdInfo.description, {}, () => {
      const cmdPath = joinCmdPath(currentCmdInfo);
      dispatchCommand(cmdPath);
    }).argv;
    return;
  }

  // 当使用-h时输出帮助命令
  if (!currentCmd) {
    if (yargs.argv.h || yargs.argv.help) {
      console.log(commandUsage(cmds));
    } else if (yargs.argv.v || yargs.argv.version) {
      console.log(`mona v${getPkgVersion()}`);
    } else {
      console.log(`mona v${getPkgVersion()}`);
    }
  } else if (currentCmd === 'update') {
    const pkgUpdater = new PackageUpdater();
    pkgUpdater.start();
  } else {
    console.log(`无效的命令，使用 ${chalk.yellow(`${getPkgName()} -h`)} 查看帮助`);
  }
}

export default mona;
