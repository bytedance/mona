import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

function handleFile(fileName, defaultData) {

  const configPath = path.resolve(process.cwd(), `./src/${fileName}.json`);
  const targetPath = path.resolve(process.cwd(), `./dist/${fileName}.json`);
  const targetDir = path.resolve(process.cwd(), './dist');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, defaultData);
  }

  if (fs.existsSync(configPath) && fs.existsSync(targetPath)) {
    fs.copyFileSync(configPath, targetPath);
    console.log('test',77777)
    console.log(chalk.green(`copy ${fileName}.json success`));
  }
}

export default class MvJsonPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('AfterBuild', () => {
      handleFile('schema', '{}');
      handleFile('review', '');
    });
  }
}
