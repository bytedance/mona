import fs from 'fs';
import path from 'path';

export function readTypescriptFile(filename: string) {
  try {
    require('@babel/register')({
      presets: [
        [require.resolve('@babel/preset-env'), { modules: 'commonjs' }],
        require.resolve('@babel/preset-typescript'),
      ],
      extensions: ['.ts', '.tsx'],
      cache: false,
    });
    delete require.cache[require.resolve(filename)];
    const config = require(filename).default || require(filename);
    if (typeof config !== 'object') {
      throw new Error('无效的配置文件');
    }
    return config;
  } catch (err) {
    console.error(`读取配置文件失败，使用默认配置，请查看 ${filename} 是否正确`);
    console.error((err as Error).message);
    return {};
  }
}

export function readJavascriptFile(filename: string) {
  try {
    require('@babel/register')({
      presets: [[require.resolve('@babel/preset-env'), { modules: 'commonjs' }]],
      extensions: ['.js', 'jsx'],
      cache: false,
    });
    delete require.cache[require.resolve(filename)];
    const config = require(filename).default || require(filename);
    if (typeof config !== 'object') {
      throw new Error('无效的配置文件');
    }
    return config;
  } catch (err) {
    console.error(`读取配置文件失败，使用默认配置，请查看 ${filename} 是否正确`);
    console.error((err as Error).message);
    return {};
  }
}

function readConfig<T = any>(filename: string): T {
  let cookedFilename = filename;
  const rawExt = path.extname(filename);
  if (['ts', 'js'].indexOf(rawExt) === -1) {
    for (const ext of ['ts', 'js']) {
      if (fs.existsSync(`${filename}.${ext}`)) {
        cookedFilename = `${filename}.${ext}`;
        break;
      }
    }
  }
  if (!fs.existsSync(cookedFilename)) {
    return {} as T;
  }
  return path.extname(cookedFilename) === '.ts'
    ? readTypescriptFile(cookedFilename)
    : readJavascriptFile(cookedFilename);
}

export default readConfig;
