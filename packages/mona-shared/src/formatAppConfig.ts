import path from 'path';
import fs from 'fs';
import { AppConfig } from '@bytedance/mona';
import formatMiniPath from './formatMiniPath';
import { getHashDigest } from 'loader-utils';

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

  return `/${contentHash}${ext}`;
}

function formatAppConfig(rawConfig: AppConfig, input: string): AppConfig {
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

export default formatAppConfig;