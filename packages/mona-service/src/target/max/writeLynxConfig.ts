import path from 'path';
import fs from 'fs';

export const getLynxEntry = (tempReactLynxDir: string) => {
  // 兼容window路径
  let lynxEntry = path.join(tempReactLynxDir, 'index.jsx');
  if (process.platform === 'win32' && lynxEntry.indexOf('\\') !== -1) {
    lynxEntry = lynxEntry.replace(/\\/g, '\\\\\\\\');
  }
  return lynxEntry;
};
export const writeLynxConfig = (tempReactLynxDir: string) => {
  const lynxConfigFile = path.join(tempReactLynxDir, 'lynx.config.js');
  let lynxEntry = getLynxEntry(tempReactLynxDir);

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
                schema(origin) {
                  return 'doudian://monaview?url=' + encodeURIComponent(origin)
                }
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
