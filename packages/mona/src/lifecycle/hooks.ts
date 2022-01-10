import { useLayoutEffect, useContext } from 'react';
import { AppLifecycleGlobalContext, Callback, PageLifecycleGlobalContext } from './context';

// for app
export function useAppEvent(eventName: string, callback: Callback) {
  const appLifecycle = useContext(AppLifecycleGlobalContext);

  useLayoutEffect(() => {
    if (appLifecycle) {
      appLifecycle.registerLifecycle(eventName, callback);
    }
  });
}

// for page
export function usePageEvent(eventName: string, callback: Callback) {
  const pageLifecycleContext = useContext(PageLifecycleGlobalContext);

  useLayoutEffect(() => {
    if (pageLifecycleContext) {
      pageLifecycleContext.registerLifecycle(eventName, callback);
    }
  });
}
