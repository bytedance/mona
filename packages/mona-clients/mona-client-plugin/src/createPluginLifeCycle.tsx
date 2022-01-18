import React from 'react';

import { LifecycleContext, AppLifecycleGlobalContext, AppLifecycle } from '@bytedance/mona';
import { isClassComponent, GLOBAL_LIFECYCLE_STORE } from '@bytedance/mona-shared';
import events from '@bytedance/mona-plugin-events';

export function createPluginLifeCycle(Component: React.ComponentType<any>) {
  const appLifecycleContext = new LifecycleContext();
  const appEntryRef = React.createRef<any>();

  const callLifecycle = (callbackName: AppLifecycle, ...params: any[]) => {
    const cbs = appLifecycleContext.lifecycle[callbackName] || [];
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

  //@ts-ignore
  window[GLOBAL_LIFECYCLE_STORE] = {
    handleLaunch,
    handleHide,
    handleShow,
    handlePageNotFound,
  };

  class AppConfig extends React.Component {
    componentDidMount() {
      handleLaunch();
      events.pigeon?.onShow?.(handleShow);
      events.pigeon?.onHide?.(handleHide);
      // events.pigeon?.onPageNotFound?.(handlePageNotFound);
    }
    componentWillUnmount() {
      events.removePluginListener('onShow');
      events.removePluginListener('onHide');
      // events.removePluginListener('onPageNotFound');
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
