
import path from 'path';
import fs from 'fs';
import { AppConfig } from '@bytedance/mona';
import { ConfigHelper } from '@/configHelper';
import formatMiniPath from '@/utils/formatMiniPath';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { getHashDigest } from 'loader-utils';
import { Compiler } from 'webpack';

const defaultAppConfig: AppConfig = {
  pages: []
}

function formatIconPath(input: string, iconPath?: string) {
  if (!iconPath) {
    return iconPath;
  }

  const filePath = path.join(input, iconPath);
  if (!fs.existsSync(filePath)) {
    throw new Error("can't find iconPath " + iconPath);
  }

  // @ts-ignore
  const contentHash = getHashDigest(fs.readFileSync(filePath), 'md5', 'hex', 16);
  const ext = path.extname(filePath);

  return `${contentHash}${ext}`;
}

export function formatAppConfig(rawConfig: AppConfig, input: string): AppConfig {
  let config: AppConfig = {
    ...defaultAppConfig,
    ...rawConfig,
  }

  // format tabBar-list-pagePath
  if (config.tabBar) {
    config = {
      ...config,
      tabBar: {
        ...config.tabBar,
        list: config.tabBar.list.map(item => ({ ...item, iconPath: formatIconPath(input, item.iconPath), selectedIconPath: formatIconPath(input, item.selectedIconPath || item.iconPath),  pagePath: formatMiniPath(item.pagePath) }))
      }
    }
  }

  // format entryPagePath
  if (config.entryPagePath) {
    config = {
      ...config,
      entryPagePath: formatMiniPath(config.entryPagePath)
    }
  }

  return {
    ...config,
    pages: config.pages.map(p => formatMiniPath(p)),
  }
}

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
    console.log(patterns);
    new CopyWebpackPlugin({ patterns }).apply(compiler)
  }
}