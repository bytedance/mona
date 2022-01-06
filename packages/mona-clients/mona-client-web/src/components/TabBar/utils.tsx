// import { useState, useEffect } from 'react';
// import { AppConfig, BaseApis, Callbacks, CommonErrorArgs } from '@bytedance/mona';
import { redirectTo } from '../../apis';
import formatPath from '../../utils/formatPath';
import { BaseApis } from '@bytedance/mona';
import { useHistory } from 'react-router';
import { TabBarProps } from '.';
import { useState } from 'react';
// import { TabBarProps } from './index';

export interface MONA_WEB_TAB_BAR_HANDLE {
  showTabBarRedDot: BaseApis['showTabBarRedDot'];
  setTabBarStyle: BaseApis['setTabBarStyle'];
  setTabBarItem: BaseApis['setTabBarItem'];
  setTabBarBadge: BaseApis['setTabBarBadge'];
  removeTabBarBadge: BaseApis['removeTabBarBadge'];
  hideTabBarRedDot: BaseApis['hideTabBarRedDot'];
}

export const useSelectTab = (tab?: TabBarProps) => {
  const history = useHistory();
  const getIndex = () => tab?.list?.findIndex(v => formatPath(v.pagePath) === history.location.pathname);
  const [current, setCurrent] = useState(getIndex());
  const onSelect = (url: string) => {
    redirectTo({ url })
    setCurrent(getIndex())
  }
  
  return { currentIndex: current, setCurrent: onSelect }
}

declare global {
  interface Window {
    __MONA_WEB_TAB_BAR_HANDLE: MONA_WEB_TAB_BAR_HANDLE;
  }
}

// export const useTabBarHandle = (props: { tab?: TabBarProps }) => {
  // const [tab, setTab] = useState(props?.tab || { list: [] as AppConfig['tabBar']['list'] });

  // const removeBadge = (params: { index: number } & Callbacks<CommonErrorArgs, CommonErrorArgs>, funccName: string) => {
  //   const errMsg = `${funccName}:fail`;

  //   if (!params.index) {
  //     params.fail?.({ errMsg });
  //     params.complete?.({ errMsg });
  //   } else {
  //     const errMsg = `${funccName}:ok`;
  //     tab.list = tab.list.map((v, i) => {
  //       if (i === params.index) {
  //         v.badgeText = undefined;
  //         v.dot = undefined;
  //       }
  //       return v;
  //     });
  //     setTab({ ...tab });
  //     params.success?.({ errMsg });
  //     params.complete?.({ errMsg });
  //   }
  // };

  // window.__MONA_WEB_TAB_BAR_HANDLE = {
  //   showTabBarRedDot: params => {
  //     const errMsg = 'showTabBarRedDot:fail';
  //     if (!params.index) {
  //       params.fail?.({ errMsg });
  //       params.complete?.({ errMsg });
  //     } else {
  //       const errMsg = 'showTabBarRedDot:ok';
  //       tab.list = tab.list.map((v, i) => {
  //         if (i === params.index) {
  //           v.dot = true;
  //         }
  //         return v;
  //       });

  //       setTab({ ...tab });
  //       params.success?.({ errMsg });
  //       params.complete?.({ errMsg });
  //     }
  //   },
  //   setTabBarStyle: (params = {}) => {
  //     let errMsg = 'setTabBarStyle:fail';

  //     if (!params.backgroundColor && !params.borderStyle && !params.selectedColor && !params.color) {
  //       params.fail?.({ errMsg });
  //       params.complete?.({ errMsg });
  //     } else {
  //       errMsg = 'setTabBarStyle:ok';
  //       setTab({ ...tab, ...params });
  //       params.success?.({ errMsg });
  //       params.complete?.({ errMsg });
  //     }
  //   },
  //   setTabBarItem: params => {
  //     if (!params.index) {
  //       params.fail?.({ errMsg: 'setTabBarItem:fail' });
  //       params.complete?.({ errMsg: 'setTabBarItem:fail' });
  //     } else {
  //       tab.list = tab.list.map((v, i) => {
  //         if (i === params.index) {
  //           v = { ...v, ...params };
  //         }
  //         return v;
  //       });
  //       setTab({ ...tab });
  //       params.success?.({ errMsg: 'setTabBarItem:ok' });
  //       params.complete?.({ errMsg: 'setTabBarItem:ok' });
  //     }
  //   },

  //   setTabBarBadge: params => {
  //     tab.list = tab.list.map((v, i) => {
  //       if (i === params.index) {
  //         v.badgeText = params.text;
  //       }
  //       return v;
  //     });
  //     setTab({ ...tab });
  //   },
  //   removeTabBarBadge: params => removeBadge(params, 'removeTabBarBadge'),
  //   hideTabBarRedDot: params => removeBadge(params, 'hideTabBarRedDot'),
  // };

  // useEffect(
  //   () => () => {
  //     window.__MONA_WEB_TAB_BAR_HANDLE = {} as unknown as MONA_WEB_TAB_BAR_HANDLE;
  //   },
  //   []
  // );

  // return { tab };
// };
