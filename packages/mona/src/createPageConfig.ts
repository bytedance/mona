export interface PageConfig {
  navigationBarBackgroundColor?: string;
  navigationBarTextStyle?: 'black' | 'white';
  navigationBarTitleText?: string;
  navigationStyle?: 'default' | 'custom';
  backgroundColor?: string;
  backgroundTextStyle?: 'dark' | 'light';
  enablePullDownRefresh?: boolean;
  disableScroll?: boolean;
  disableSwipeBack?: boolean;
  onReachBottomDistance?: number;
  usingComponents?: Record<string, string>;
}

export function createPageConfig(pageConfig: PageConfig) {
  return pageConfig;
}
