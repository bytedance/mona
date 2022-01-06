import path from 'path';
import { AppConfig } from '@bytedance/mona';
import { ConfigHelper } from '@/configHelper';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { Compiler } from 'webpack';

export function generateCopyConfig(configHelper: ConfigHelper, formatedAppConfig: AppConfig) {
  const { appConfig, cwd, projectConfig } = configHelper;
  const input = cwd;
  const output = path.join(cwd, projectConfig.output);
  if (appConfig.tabBar?.list) {
    const list = appConfig.tabBar?.list ?? [];
    const formatedList = formatedAppConfig.tabBar?.list ?? [];
    let copyConfig: { from: string, to: string }[] = []
    for (let i = 0; i < appConfig.tabBar?.list.length; i++) {
      const f1 = list[i].iconPath
      const t1 = formatedList[i].iconPath
      const f2 = list[i].selectedIconPath || f1
      const t2 = formatedList[i].selectedIconPath || f1
      if (f1 && t1 && (copyConfig.findIndex(item => item.from === path.join(input, f1)) === -1)) {
        copyConfig.push({ from: path.join(input, f1), to: path.join(output, t1) });
      }
      if (f2 && t2 && (copyConfig.findIndex(item => item.from === path.join(input, f2)) === -1)) {
        copyConfig.push({ from: path.join(input, f2), to: path.join(output, t2) });
      }
    }

    return copyConfig;
  }
  return null;
}

export function applyCopyWebpackPlugin( compiler: Compiler, configHelper: ConfigHelper, formatedAppConfig: AppConfig) {
  const patterns = generateCopyConfig(configHelper, formatedAppConfig);
  
  if (patterns) {
    new CopyWebpackPlugin({ patterns }).apply(compiler)
  }
}