import React from 'react';

import {
  LifecycleContext,
  AppLifecycleGlobalContext,
  AppLifecycle,
  PageLifecycle,
  PageLifecycleGlobalContext,
} from '@bytedance/mona';
import { isClassComponent, GLOBAL_LIFECYCLE_STORE, parseSearch } from '@bytedance/mona-shared';
import { lightAppLifeCycleParamsKey } from './constants';

export function createPluginLifeCycle(Component: React.ComponentType<any>) {
  const appLifecycleContext = new LifecycleContext();
  const appEntryRef = React.createRef<any>();

  const callLifecycle = (callbackName: AppLifecycle, ...params: any[]) => {
    const cbs = appLifecycleContext.lifecycle[callbackName] || new Set([]);
    cbs.forEach(cb => cb(...params));

    if (appEntryRef.current?.[callbackName]) {
      return appEntryRef.current[callbackName](...params);
    }
  };

  const handleShow = (...rest: any[]) => {
    callLifecycle(AppLifecycle.show, ...rest);
  };
  const handleHide = (...rest: any[]) => {
    callLifecycle(AppLifecycle.hide, ...rest);
  };
  const handleLaunch = (...rest: any[]) => {
    callLifecycle(AppLifecycle.launch, ...rest);
  };

  const handlePageNotFound = (...rest: any[]) => {
    callLifecycle(AppLifecycle.pageNotFound, ...rest);
  };

  // 这里名称不要随便改，微应用会在容器层调用部分函数
  //@ts-ignore
  window[GLOBAL_LIFECYCLE_STORE] = {
    handleLaunch,
    handlePageNotFound,
    handleShow,
    handleHide,
  };

  class AppConfig extends React.Component {
    componentDidMount() {
      handleShow(window[lightAppLifeCycleParamsKey.show as any] || {});
      handleLaunch(window[lightAppLifeCycleParamsKey.launch as any] || {});
    }
    componentWillUnmount() {}
    render() {
      if (isClassComponent(Component)) {
        return <Component {...this.props} ref={appEntryRef}></Component>;
      }
      return <Component {...this.props}></Component>;
    }
  }

  return (props: any) => (
    <AppLifecycleGlobalContext.Provider value={appLifecycleContext}>
      <AppConfig {...props} />
    </AppLifecycleGlobalContext.Provider>
  );
}

export function createPluginPageLifecycle(Component: React.ComponentType<any>) {
  const PageLifecycleContext = new LifecycleContext();
  const pageEntryRef = React.createRef<any>();

  const callLifecycle = (callbackName: PageLifecycle, ...params: any[]) => {
    const cbs = PageLifecycleContext.lifecycle[callbackName] || new Set([]);
    cbs.forEach(cb => cb(...params));

    if (pageEntryRef.current?.[callbackName]) {
      return pageEntryRef.current[callbackName](...params);
    }
  };

  // const handleResize = (...rest: any[]) => {
  //   callLifecycle(PageLifecycle.resize, ...rest);
  // };
  const handleLoad = (...rest: any[]) => {
    callLifecycle(PageLifecycle.load, ...rest);
  };
  const handleUnload = (...rest: any[]) => {
    callLifecycle(PageLifecycle.unload, ...rest);
  };
  const handleReady = (...rest: any[]) => {
    callLifecycle(PageLifecycle.ready, ...rest);
  };
  // const handleVisibilityChange = () => {
  //   if (document.visibilityState === 'visible') {
  //     callLifecycle(PageLifecycle.show);
  //   } else {
  //     callLifecycle(PageLifecycle.hide);
  //   }
  // };
  // document.addEventListener('visibilitychange', handleVisibilityChange);
  // onResize
  // window.addEventListener('resize', handleResize);
  class PageWrapper extends React.Component {
    isReachBottom = false;
    componentDidMount() {
      // onLoad
      handleLoad(parseSearch(location.search));
      // onShow & onHide
      // if (document.visibilityState === 'visible') {
      //   callLifecycle(PageLifecycle.show);
      // }

      // onReady
      handleReady();
    }
    componentWillUnmount() {
      // onUnload
      handleUnload();
      // window.removeEventListener('resize', handleResize);
      // document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

    render() {
      if (isClassComponent(Component)) {
        return <Component {...this.props} ref={pageEntryRef}></Component>;
      }
      return <Component {...this.props}></Component>;
    }
  }

  return (props: any) => (
    <PageLifecycleGlobalContext.Provider value={PageLifecycleContext}>
      <PageWrapper {...props} />
    </PageLifecycleGlobalContext.Provider>
  );
}
