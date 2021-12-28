import yargs from 'yargs';
import chalk from 'chalk';
import { buildCommandUsage, startCommandUsage } from './help';
import { Builder } from './builder';

export type Target = 'mini' | 'plugin' | 'web';
export interface Options {
  dev?: boolean;
  port?: string;
  target?: Target;
}

function build({ dev }: { dev: boolean }) {
  yargs.version(false).help(false).alias('p', 'port').alias('h', 'help').alias('t', 'target');
  yargs.command('$0', false, {}, async function (argv) {
    if (argv.help) {
      const helpInfo = dev ? startCommandUsage() : buildCommandUsage();
      console.log(helpInfo);
      return;
    }

    if (!['mini', 'plugin', 'web'].includes(argv.target as string)) {
      console.log(chalk.red(`无效的目标端：${argv.target}`))
      console.log(chalk.cyan(`有效值：mini | web | plugin`))
      return;
    }
    try {
      // 分析参数
      const builder = new Builder({ ...argv, dev })
      if (dev) {
        builder.start();
      } else {
        builder.build();
      }
    } catch (err: any) {
      console.log(chalk.red(err.message));
      console.log(err);
    }
  }).argv;
}

export default build;
