import React from 'react';

import { LifecycleContext, AppLifecycleGlobalContext, AppLifecycle } from '@bytedance/mona';
import { isClassComponent } from '@bytedance/mona-shared/dist/reactNode';
import { GLOBAL_LIFECYCLE_STORE } from '@bytedance/mona-shared/dist/constants';

const lightAppLifeCycleParamsKey = {
  launch: '__MONA_LIGHT_APP_LIFE_CYCLE_LANUCH_QUERY',
  show: '__MONA_LIGHT_APP_LIFE_CYCLE_SHOW_QUERY',
};

export function createAppLifeCycle(Component: React.ComponentType<any>) {
  const appLifecycleContext = new LifecycleContext();
  const appEntryRef = React.createRef<any>();

  const callLifecycle = (callbackName: AppLifecycle, ...params: any[]) => {
    const cbs = appLifecycleContext.lifecycle[callbackName] || new Set([]);

    Array.from(cbs).forEach(cb => cb(...params));
    if (appEntryRef.current?.[callbackName]) {
      return appEntryRef.current[callbackName](...params);
    }
  };

  const handleError = (...rest: any[]) => {
    callLifecycle(AppLifecycle.error, ...rest);
  };
  const handleLaunch = (...rest: any[]) => {
    callLifecycle(AppLifecycle.launch, ...rest);
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      callLifecycle(AppLifecycle.show);
    } else {
      callLifecycle(AppLifecycle.hide);
    }
  };
  const handlePageNotFound = (...rest: any[]) => {
    callLifecycle(AppLifecycle.pageNotFound, ...rest);
  };
  const handleShow = (...rest: any[]) => {
    callLifecycle(AppLifecycle.show, ...rest);
  };
  const handleHide = (...rest: any[]) => {
    callLifecycle(AppLifecycle.hide, ...rest);
  };

  //@ts-ignore
  window[GLOBAL_LIFECYCLE_STORE] = {
    handleError,
    handleLaunch,
    handleVisibilityChange,
    handlePageNotFound,
    handleShow,
    handleHide,
  };
  // onError
  window.addEventListener('error', handleError);
  // onShow & onHide
  document.addEventListener('visibilitychange', handleVisibilityChange);
  class AppConfig extends React.Component {
    // componentDidCatch
    componentDidMount() {
      handleVisibilityChange();
      handleShow(window[lightAppLifeCycleParamsKey.show as any] || {});
      handleLaunch(window[lightAppLifeCycleParamsKey.launch as any] || {});
    }
    componentWillUnmount() {
      window.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
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
