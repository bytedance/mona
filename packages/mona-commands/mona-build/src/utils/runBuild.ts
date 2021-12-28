import chalk from 'chalk';
import ora from 'ora';
import { Compiler } from "webpack";

export default function runBuild(compiler: Compiler) {
  const spinner = ora('编译中...').start()
  spinner.color = 'green';
  compiler.run((error: any, stats: any) => {
  if (error) {
    throw error;
  }

  const info = stats?.toJson();
  if (stats?.hasErrors()) {
    info?.errors?.forEach((err: Error) => {
      console.log(chalk.red(err.message));
    });
    spinner.fail('编译失败')
    process.exit(1);
  }
  if (stats?.hasWarnings()) {
    info?.warnings?.forEach((w: Error) => {
      console.log(chalk.yellow(w.message));
    });
  }
  // Object.keys(info?.assetsByChunkName || {}).forEach((chunkName) => {
  //   const assets = (info?.assetsByChunkName || {})[chunkName];
  //   console.info(chalk.green(`Chunk: ${chunkName}`));
  //   if (Array.isArray(assets)) {
  //     assets.forEach(asset => console.log(chalk.green(` file: ${asset}`)))
  //   }
  //   console.log('')
  // })
  spinner.succeed(`编译成功 ${new Date().toLocaleString()}`)
  process.exit(0)
})
}
