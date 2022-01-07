import path from 'path';
import fs from 'fs';
import { getHashDigest } from 'loader-utils';

// redundant define AppConfig to avoid import @bytedance/mona
interface AppConfigWindow {
  navigationBarBackgroundColor?: string;
  navigationBarTextStyle?: 'black' | 'white';
  navigationBarTitleText?: string;
  navigationStyle?: 'default' | 'custom';
  backgroundColor?: string;
  backgroundTextStyle?: 'dark' | 'light';
  backgroundColorTop?: string;
  backgroundColorBottom?: string;
  enablePullDownRefresh?: boolean;
  onReachBottomDistance?: number;
  transparentTitle?: 'none' | 'always' | 'auto'
}

interface AppConfigTabBarItem {
  pagePath: string;
  text: string;
  iconPath?: string;
  selectedIconPath?: string;
}
interface AppConfigTabBar {
  color: string;
  selectedColor: string;
  backgroundColor: string;
  borderStyle?: 'black' | 'white';
  list: AppConfigTabBarItem[]
}

type PermissionNames = 'scope.userLocation' | 'scope.address' | 'scope.record' | 'scope.album' | 'scope.camera';

type AppConfigTabBarPermission = {
  [key in PermissionNames]: {
    desc?: string
  }
}

interface AppConfigNetworkTimeout {
  request?: number;
  connectSocket?: number;
  uploadFile?: number;
  downloadFile?: number;
}

export interface AppConfig {
  pages: string[];
  entryPagePath?: string;
  window?: AppConfigWindow;
  tabBar?: AppConfigTabBar;
  navigateToMiniProgramAppIdList?: string[];
  permission?: AppConfigTabBarPermission;
  networkTimeout?: AppConfigNetworkTimeout;
}

const defaultAppConfig: AppConfig = {
  pages: []
}

function formatMiniPath(url: string = '') {
  return url.toLowerCase().replace(/^\//, '');
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