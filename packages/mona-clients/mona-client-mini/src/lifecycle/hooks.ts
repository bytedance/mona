import { useLayoutEffect, useContext } from 'react';
import { LifecycleContext, Callback, PageLifecycleGlobalContext } from './context';

// for app
export const appLifecycleContext = new LifecycleContext();
export function useAppEvent(eventName: string, callback: Callback) {
  useLayoutEffect(() => {
    appLifecycleContext.registerLifecycle(eventName, callback);
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
