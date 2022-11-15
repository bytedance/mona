import path from 'path';
import fs from 'fs';
// import fsPromises from 'node:fs/promises';
import ConfigHelper from '../../ConfigHelper';

export const writeLynxConfig = (maxTmp: string, configHelper: ConfigHelper) => {
  const monaConfig = configHelper.projectConfig;
  const lynxConfigFile = path.join(maxTmp, 'lynx.config.js');
  let reg = /\.[j|t]s$/;
  let finalEntry = monaConfig.input.replace(reg, '.jsx');
  if (!finalEntry) {
    throw new Error('未找到入口文件');
  }
  const lynxEntry = path.join(maxTmp, finalEntry);
  const lynxConfigStr = `
          module.exports = [
            {
              name: "dynamicComponent",
              input: {
                main: "${lynxEntry}",
              },
              dsl: "dynamic-component-ng",
              encode: {
                targetSdkVersion: "1.6",
              },
            },
            {
              name: "reactLynxWeb",
              input: {
                "react-lynx-web":  "${lynxEntry}",
              },
              dsl: "compilerNgWeb",
              runtimeTarget: "compilerNgWebRuntime",
              define: {
                __H5__: true,
              },
              encode: {
                targetSdkVersion: "1.6",
              },
              webOptions: {
                devtool: {
                  hmr: true,
                },
              },
            },
          ];
          `;
  return fs.writeFileSync(lynxConfigFile, lynxConfigStr);
};
