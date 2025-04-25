import path from 'path';
import fs from 'fs';
import { NavComponent } from '.';

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
  navComponent,
  debugPage = '',
  notBuildWeb = false,
}: {
  tempReactLynxDir: string;
  appid: string;
  debugPage: string;
  navComponent?: NavComponent;
  notBuildWeb?: boolean;
}) => {
  const lynxConfigFile = path.join(tempReactLynxDir, 'lynx.config.js');
  const lynx3ConfigFile = path.join(tempReactLynxDir, 'lynx-3.config.mjs');
  const lynxEntry = getLynxEntry(tempReactLynxDir);
  const webEntry = getLynxEntry(tempReactLynxDir, true);
  const insertCode = typeof process.env.INSERT_LYNX_CONFIG === 'string' ? process.env.INSERT_LYNX_CONFIG : '';

  const lynxConfigStr = `
          const WebBootstrapPlugin = require('../target/max/plugins/WebBootstrapPlugin.js').default;
          ${insertCode}
          const plugins = typeof insertPlugins !== 'undefined' && Array.isArray(insertPlugins) ? insertPlugins: []          
          module.exports = [
            {
              name: "app",
              input: {
                "app": "${lynxEntry}",
              },
              dsl: 'compilerNg',
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
              ${
                notBuildWeb
                  ? 'plugins,'
                  : `plugins: [...plugins, WebBootstrapPlugin({ entry: "${webEntry}", appid: "${appid}", navComponent: ${
                      navComponent ? JSON.stringify(navComponent) : 'undefined'
                    }, debugPage: "${debugPage}" })],`
              }
              define: {
                __MONA_APPID: JSON.stringify("${appid}"),
                __IS_LYNX3: JSON.stringify(false)
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
              ${
                notBuildWeb
                  ? 'plugins,'
                  : `plugins: [...plugins, WebBootstrapPlugin({ entry: "${webEntry}", appid: "${appid}",navComponent: ${
                      navComponent ? JSON.stringify(navComponent) : 'undefined'
                    }, debugPage: "${debugPage}" })],`
              }
              define: {
                __MONA_APPID: JSON.stringify("${appid}"),
                __IS_LYNX3: JSON.stringify(false)
              },
              compilerNGOptions:{
                disableRuntimeCheckUnintentionalSetState:true,
              }
            },
          ];
          `;
  const lynx3ConfigStr = `
          import { pluginReactLynx } from "@byted-lynx/react-rsbuild-plugin";
          import { pluginLess } from '@rsbuild/plugin-less';
          import { defineConfig } from "@byted-lynx/rspeedy";

          ${insertCode}
          const plugins = typeof insertPlugins !== 'undefined' && Array.isArray(insertPlugins) ? insertPlugins: []        

          export default defineConfig({
            source: {
              entry: {
                component: "${lynxEntry}"
              },
              alias: {
                '@bytedance/mona-speedy-runtime': '@byted-lynx/react'
              },
              define: {
                __MONA_APPID: JSON.stringify("${appid}"),
                __IS_LYNX3: JSON.stringify(true)
              },
            },
            output: {
              filename: '[name]/template-3.js'
            },
            plugins: [
              pluginReactLynx({
                experimental_isLazyBundle: true,
              }),
              pluginLess({
                /** less options */
              }),
              ...plugins
            ],
          });
          `;
  fs.writeFileSync(lynxConfigFile, lynxConfigStr);
  // lynx3配置文件
  fs.writeFileSync(lynx3ConfigFile, lynx3ConfigStr);
};
