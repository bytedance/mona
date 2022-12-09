import path from 'path';
import fs from 'fs';

export const getLynxEntry = (tempReactLynxDir: string, isWeb = false) => {
  // 兼容window路径
  let lynxEntry = path.join(tempReactLynxDir, isWeb ? 'index.web.jsx' : 'index.jsx');
  if (process.platform === 'win32' && lynxEntry.indexOf('\\') !== -1) {
    lynxEntry = lynxEntry.replace(/\\/g, '\\\\\\\\');
  }
  return lynxEntry;
};
export const writeLynxConfig = (tempReactLynxDir: string, appid: string) => {
  const lynxConfigFile = path.join(tempReactLynxDir, 'lynx.config.js');
  const lynxEntry = getLynxEntry(tempReactLynxDir);
  const webEntry = getLynxEntry(tempReactLynxDir, true);

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
                targetSdkVersion: "2.1",
              },
              dev: {
                devtoolOptions: {
                  host: 'http://opws.jinritemai.com/pages/home/index'
                },
                schema(origin) {
                  return 'doudian://monaview?url=' + encodeURIComponent(origin)
                }
              },
              plugins: [WebBootstrapPlugin("${webEntry}", "${appid}")],
              define: {
                __MONA_APPID: JSON.stringify("${appid}")
              }
            },
            {
              name: "component",
              input: {
                component: "${lynxEntry}",
              },
              dsl: "dynamic-component-ng",
              encode: {
                targetSdkVersion: "2.1",
              },
              plugins: [WebBootstrapPlugin("${webEntry}", "${appid}")],
              define: {
                __MONA_APPID: JSON.stringify("${appid}")
              }
            },
          ];
          `;
  return fs.writeFileSync(lynxConfigFile, lynxConfigStr);
};
