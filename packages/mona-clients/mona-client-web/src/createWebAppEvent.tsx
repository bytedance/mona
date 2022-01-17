import React from 'react';

import { LifecycleContext, AppLifecycleGlobalContext, AppLifecycle } from '@bytedance/mona';

export function createAppLifeCycle(Component: React.ComponentType<any>) {
  const appLifecycleContext = new LifecycleContext();
  const appEntryRef = React.createRef<any>();

  const callLifecycle = (callbackName: AppLifecycle, ...params: any[]) => {
    const cbs = appLifecycleContext.lifecycle[callbackName] || [];
    cbs.forEach(cb => cb(...params));

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

  class AppConfig extends React.Component {
    componentDidMount() {
      handleVisibilityChange();
      // onError
      window.addEventListener('error', handleError);
      // onShow & onHide
      document.addEventListener('visibilitychange', handleVisibilityChange);
      // onLaunch
      handleLaunch();
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

export function isClassComponent(Component: any): Component is React.ComponentClass {
  return typeof Component.prototype?.render === 'function';
}
