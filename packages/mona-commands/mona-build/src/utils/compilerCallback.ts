import chalk from 'chalk';

const compilerCallback = (error: any, stats: any) => {
  if (error) {
    throw error;
  }

  const info = stats?.toJson();
  if (stats?.hasErrors()) {
    info?.errors?.forEach((err: Error) => {
      console.log(chalk.red(err.message));
    });
    process.exit(1);
  }
  if (stats?.hasWarnings()) {
    info?.warnings?.forEach((w: Error) => {
      console.log(chalk.yellow(w.message));
    });
  }
  Object.keys(info?.assetsByChunkName || {}).forEach((chunkName) => {
    const assets = (info?.assetsByChunkName || {})[chunkName];
    console.info(chalk.green(`Chunk: ${chunkName}`));
    if (Array.isArray(assets)) {
      assets.forEach(asset => console.log(chalk.green(` file: ${asset}`)))
    }
    console.log('')
  })
  console.log(chalk.green('打包完成'));
  process.exit(0)
}


export default compilerCallback