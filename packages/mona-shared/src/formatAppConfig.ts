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

function formatAppConfig(rawConfig: AppConfig): AppConfig {
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