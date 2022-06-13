import React from 'react';

import { LifecycleContext, AppLifecycleGlobalContext, AppLifecycle } from '@bytedance/mona';
import { isClassComponent, GLOBAL_LIFECYCLE_STORE } from '@bytedance/mona-shared';

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

  const handleLaunch = (...rest: any[]) => {
    callLifecycle(AppLifecycle.launch, ...rest);
  };
  const handlePageNotFound = (...rest: any[]) => {
    callLifecycle(AppLifecycle.pageNotFound, ...rest);
  };

  //@ts-ignore
  window[GLOBAL_LIFECYCLE_STORE] = {
    handleLaunch,
    handlePageNotFound,
  };

  class AppConfig extends React.Component {
    componentDidMount() {
      handleLaunch();
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
