import path from 'path';
import fs from 'fs';
// import fsPromises from 'node:fs/promises';
import ConfigHelper from '../../ConfigHelper';

export const writeLynxConfig = (maxTmp: string, configHelper: ConfigHelper) => {
  const monaConfig = configHelper.projectConfig;
  const lynxConfigFile = path.join(maxTmp, 'lynx.config.js');
  let reg = /\.[j|t]s$/;
  let finalEntry = monaConfig.input;
  if (!finalEntry) {
    throw new Error('未找到入口文件');
  }
  if (!reg.test(finalEntry)) {
    finalEntry += '.jsx';
  } else {
    finalEntry = monaConfig.input.replace(reg, '.jsx');
  }

  // 兼容window路径
  let lynxEntry = path.join(maxTmp, finalEntry);
  if (process.platform === 'win32' && lynxEntry.indexOf('\\') !== -1) {
    lynxEntry = lynxEntry.replace(/\\/g, '\\\\\\\\');
  }
  const lynxConfigStr = `
          module.exports = [
            {
              name: "reactLynxApp",
              input: {
                "react-lynx-app": "${lynxEntry}",
              },
              dsl: "compilerNg",
              encode: {
                targetSdkVersion: "2.2",
              },
              dev: {
                devtoolOptions: {
                  host: 'http://opws.jinritemai.com/pages/home/index'
                },
              }
            },
            // {
            //   name: "dynamicComponent",
            //   input: {
            //     main: "${lynxEntry}",
            //   },
            //   dsl: "dynamic-component-ng",
            //   encode: {
            //     targetSdkVersion: "2.2",
            //   },
            // },
            // {
            //   name: "reactLynxWeb",
            //   input: {
            //     "react-lynx-web":  "${lynxEntry}",
            //   },
            //   output: {
            //     path:"dist",
            //   },
            //   dsl: "compilerNgWeb",
            //   runtimeTarget: "compilerNgWebRuntime",
            //   define: {
            //     __H5__: true,
            //   },
            //   encode: {
            //     targetSdkVersion: "1.6",
            //   },
            //   webOptions: {
            //     devtool: {
            //       hmr: true,
            //     },
            //   },
            // },
          ];
          `;
  return fs.writeFileSync(lynxConfigFile, lynxConfigStr);
};
