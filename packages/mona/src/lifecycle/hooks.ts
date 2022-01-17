import { useLayoutEffect, useContext } from 'react';
import { AppLifecycleGlobalContext, Callback, PageLifecycleGlobalContext } from './context';

// for app
export function useAppEvent(eventName: string, callback: Callback) {
  const appLifecycle = useContext(AppLifecycleGlobalContext);

  useLayoutEffect(() => {
    let clear = appLifecycle?.registerLifecycle(eventName, callback);
    return () => clear?.();
  }, [callback, eventName, appLifecycle]);
}

// for page
export function usePageEvent(eventName: string, callback: Callback) {
  const pageLifecycleContext = useContext(PageLifecycleGlobalContext);
 
  useLayoutEffect(() => {
    let clear = pageLifecycleContext?.registerLifecycle(eventName, callback);
    return () => clear?.();
  }, [callback, eventName, pageLifecycleContext]);
}
