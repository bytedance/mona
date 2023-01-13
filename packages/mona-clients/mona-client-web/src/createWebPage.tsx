import React from 'react';
import { isClassComponent } from '@bytedance/mona-shared/dist/reactNode';
import { parseSearch } from '@bytedance/mona-shared/dist/search';

import { LifecycleContext, PageLifecycleGlobalContext, PageLifecycle } from '@bytedance/mona';

export function createPageLifecycle(Component: React.ComponentType<any>) {
  const PageLifecycleContext = new LifecycleContext();
  const pageEntryRef = React.createRef<any>();

  const callLifecycle = (callbackName: PageLifecycle, ...params: any[]) => {
    const cbs = PageLifecycleContext.lifecycle[callbackName] || new Set([]);
    Array.from(cbs).forEach(cb => cb(...params));

    if (pageEntryRef.current?.[callbackName]) {
      return pageEntryRef.current[callbackName](...params);
    }
  };

  const handleResize = (...rest: any[]) => {
    callLifecycle(PageLifecycle.resize, ...rest);
  };
  const handleLoad = (...rest: any[]) => {
    callLifecycle(PageLifecycle.load, ...rest);
  };
  const handleUnload = (...rest: any[]) => {
    callLifecycle(PageLifecycle.unload, ...rest);
  };
  const handleReady = (...rest: any[]) => {
    callLifecycle(PageLifecycle.ready, ...rest);
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      callLifecycle(PageLifecycle.show);
    } else {
      callLifecycle(PageLifecycle.hide);
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);
  // onResize
  window.addEventListener('resize', handleResize);
  class PageWrapper extends React.Component {
    isReachBottom = false;
    componentDidMount() {
      // onLoad
      handleLoad(parseSearch(location.search));
      // onShow & onHide
      if (document.visibilityState === 'visible') {
        callLifecycle(PageLifecycle.show);
      }

      // onReady
      handleReady();
    }
    componentWillUnmount() {
      // onUnload
      handleUnload();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
