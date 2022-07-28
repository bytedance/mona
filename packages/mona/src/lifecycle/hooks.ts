import { useLayoutEffect, useContext } from 'react';
import { AppLifecycle, AppLifecycleGlobalContext, Callback, PageLifecycle, PageLifecycleGlobalContext } from './context';

// for app
export function useAppEvent(eventName: `${AppLifecycle}`, callback: Callback) {
  const appLifecycle = useContext(AppLifecycleGlobalContext);
  
  useLayoutEffect(() => {
    let clear = appLifecycle?.registerLifecycle(eventName, callback);
    return () => clear?.();
  }, [callback, eventName, appLifecycle]);
}

// for page
export function usePageEvent(eventName: `${PageLifecycle}`, callback: Callback) {
  const pageLifecycleContext = useContext(PageLifecycleGlobalContext);

  useLayoutEffect(() => {
    let clear = pageLifecycleContext?.registerLifecycle(eventName, callback);
    return () => clear?.();
  }, [callback, eventName, pageLifecycleContext]);
}
