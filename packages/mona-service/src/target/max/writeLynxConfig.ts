import path from 'path';
import fs from 'fs';
// import fsPromises from 'node:fs/promises';
import ConfigHelper from '../../ConfigHelper';

export const getLynxEntry = (maxTmp: string, configHelper: ConfigHelper) => {
  const monaConfig = configHelper.projectConfig;
  let reg = /[a-zA-Z0-9_]+(\.[j|t]s)?$/;
  let finalEntry = monaConfig.input;
  if (!finalEntry) {
    throw new Error('未找到入口文件');
  }
  finalEntry = monaConfig.input.replace(reg, 'app.entry.jsx');
  // 兼容window路径
  let lynxEntry = path.join(maxTmp, finalEntry);
  if (process.platform === 'win32' && lynxEntry.indexOf('\\') !== -1) {
    lynxEntry = lynxEntry.replace(/\\/g, '\\\\\\\\');
  }
  return lynxEntry;
};
export const writeLynxConfig = (maxTmp: string, configHelper: ConfigHelper) => {
  const lynxConfigFile = path.join(maxTmp, 'lynx.config.js');
  let lynxEntry = getLynxEntry(maxTmp, configHelper);

  const lynxConfigStr = `
          const WebBootstrapPlugin = require('../target/max/plugins/WebBootstrapPlugin.js').default;
          module.exports = [
            {
              name: "app",
              input: {
                "app": "${lynxEntry}",
              },
              dsl: "compilerNg",
              encode: {
                targetSdkVersion: "2.2",
              },
              dev: {
                devtoolOptions: {
                  host: 'http://opws.jinritemai.com/pages/home/index'
                },
              },
              plugins: [WebBootstrapPlugin("${lynxEntry}")]
            },
            {
              name: "component",
              input: {
                component: "${lynxEntry}",
              },
              dsl: "dynamic-component-ng",
              encode: {
                targetSdkVersion: "2.2",
              },
              plugins: [WebBootstrapPlugin("${lynxEntry}")]
            },
          ];
          `;
  return fs.writeFileSync(lynxConfigFile, lynxConfigStr);
};
