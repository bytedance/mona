import chalk from 'chalk';

class Log {
  error(msg: string) {
    console.log(chalk.red(msg))
  }
}

const log = new Log();

export default log;