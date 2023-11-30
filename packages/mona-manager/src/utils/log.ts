import chalk from 'chalk';

class Log {
  error(msg: string) {
    console.log(chalk.red(msg))
  }
  warn(msg: string) {
    console.log(chalk.yellow(msg))
  }
}

const log = new Log();

export { log, Log };

export default log;