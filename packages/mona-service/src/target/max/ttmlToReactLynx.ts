// @ts-ignore
// import { ttmlToNg } from '@ecom/mona-speedy';
import { transformFile } from '@byted-lynx/ttml-to-ng';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import ConfigHelper from '../../ConfigHelper';

export const ttmlToReactLynx = (maxTmp: string, configHelper: ConfigHelper, isWatch: boolean = true) => {
  const souceDirName = 'src';
  ttmlToReactLynxRecur(maxTmp, souceDirName, configHelper.cwd);
  const sourceDir = path.join(configHelper.cwd, souceDirName);
  if (isWatch) {
    chokidar.watch(sourceDir).on('all', () => {
      ttmlToReactLynxRecur(maxTmp, souceDirName, configHelper.cwd);
    });
  }
};

const ttmlToReactLynxRecur = (maxTmp: string, baseDir: string, cwd: string) => {
  // 在maxTmp中创建相应dir
  const maxTmpBaseDir = path.join(maxTmp, baseDir);
  const sourceBaseDir = path.join(cwd, baseDir);
  if (!fs.existsSync(maxTmpBaseDir)) {
    fs.mkdirSync(maxTmpBaseDir);
  }
  // 看本文件夹中是否有index.ttml等，若有进行转换
  if (isTtmlDir(sourceBaseDir)) {
    transfromTtmlDir(sourceBaseDir, maxTmpBaseDir);
  }
  // 遍历本文件夹中的所有文件夹
  fs.readdirSync(sourceBaseDir, { withFileTypes: true }).forEach(item => {
    if (item.isDirectory()) {
      ttmlToReactLynxRecur(maxTmp, path.join(baseDir, item.name), cwd);
    }
  });
};

const isTtmlDir = (dir: string) => {
  if (
    fs.existsSync(path.join(dir, 'index.ttml')) &&
    fs.existsSync(path.join(dir, 'index.ttss')) &&
    fs.existsSync(path.join(dir, 'index.json')) &&
    (fs.existsSync(path.join(dir, 'index.js')) || fs.existsSync(path.join(dir, 'index.ts')))
  ) {
    return true;
  } else {
    return false;
  }
};

const transfromTtmlDir = (baseDir: string, distDir: string) => {
  transformFile(
    {
      baseDir: baseDir,
      filename: 'index',
      //   componentName: `arco-${name}`,
      distDir: distDir,
      distName: `index.jsx`,
      options: {
        inlineLepus: true,
        reactRuntimeImportDeclaration: 'import ReactLynx, { Component } from "@ecom/mona-speedy-runtime"',
        // componentPathRewrite(name, path) {
        //   // arco-icon @byted-lynx/ui/components/icon/icon
        //   const pathname = path.split('/').splice(-1)[0];
        //   return `../${pathname}/index.jsx`;
        // },
      },
    },
    true,
  );
  //复制ttss->scss
  const ttssSrcFilePath = path.resolve(baseDir, `index.ttss`);
  const ttssDistDirFilePath = path.resolve(distDir, `index.scss`);
  if (fs.existsSync(ttssSrcFilePath)) {
    fs.copyFileSync(ttssSrcFilePath, ttssDistDirFilePath);
  }
};
