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
    return config;
  } catch(_) {
    return null
  }
}

export function readJavascriptFile(filename: string) {
  try {
    require('@babel/register')({
      presets: [
        [require.resolve('@babel/preset-env'), { modules: 'commonjs' }],
      ],
      extensions: ['.js', 'jsx'],
      cache: false,
    });
    delete require.cache[require.resolve(filename)];
    const config = require(filename).default || require(filename);
    return config;
  } catch(_) {
    return null
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
