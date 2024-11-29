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
export const writeLynxConfig = ({
  tempReactLynxDir,
  appid,
  useComponent = false,
  notBuildWeb = false,
}: {
  tempReactLynxDir: string;
  appid: string;
  useComponent?: boolean;
  notBuildWeb?: boolean;
}) => {
  const lynxConfigFile = path.join(tempReactLynxDir, 'lynx.config.js');
  const lynx3ConfigFile = path.join(tempReactLynxDir, 'lynx-3.config.js');
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
              dsl: ${useComponent ? JSON.stringify('dynamic-component-ng') : JSON.stringify('compilerNg')},
              encode: {
                targetSdkVersion: "2.1",
                defaultOverflowVisible:false,
                enableEventRefactor: true,
              },
              dev: {
                devtoolOptions: {
                  host: 'http://opws.jinritemai.com/pages/home/index'
                },
                schema(origin) {
                  return 'doudian://monaview?url=' + encodeURIComponent(origin)
                }
              },
              ${notBuildWeb ? '' : `plugins: [WebBootstrapPlugin("${webEntry}", "${appid}")],`}
              define: {
                __MONA_APPID: JSON.stringify("${appid}")
              },
              pageConfig: {
                useNewSwiper: true,
                enableCSSInheritance: true,
                customCSSInheritanceList: ['direction'],
                enableRadonCompatible: false,
              },
              compilerNGOptions:{
                disableRuntimeCheckUnintentionalSetState:true,
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
                defaultOverflowVisible:false,
                enableEventRefactor: true
              },
              ${notBuildWeb ? '' : `plugins: [WebBootstrapPlugin("${webEntry}", "${appid}")],`}
              define: {
                __MONA_APPID: JSON.stringify("${appid}")
              },
              compilerNGOptions:{
                disableRuntimeCheckUnintentionalSetState:true,
              }
            },
          ];
          `;
          const lynx3ConfigStr = `
          import { pluginReactLynx } from "@byted-lynx/react-rsbuild-plugin";
          import { defineConfig } from "@byted-lynx/rspeedy";

          export default defineConfig({
            source: {
              entry: "${lynxEntry}",
              alias: {
                '@bytedance/mona-speedy-runtime': '@byted-lynx/react'
              },
              define: {
                __MONA_APPID: JSON.stringify("${appid}")
              },
            },
            plugins: [
              pluginReactLynx({
                experimental_isLazyBundle: true,
              }),
            ],
          });
          `;
  fs.writeFileSync(lynxConfigFile, lynxConfigStr);
  // lynx3配置文件
  fs.writeFileSync(lynx3ConfigFile, lynx3ConfigStr);
};
