import { useLayoutEffect, useContext } from 'react';
import { AppLifecycle, AppLifecycleGlobalContext, Callback, PageLifecycle, PageLifecycleGlobalContext } from './context';

type CallbakcQuery = Record<string, string | number | boolean>;
type AppLifecycleUnion = `${AppLifecycle}`
type AppLaunchOrShow = 'onLaunch' | 'onShow';
interface AppLaunchOrShowParams {
  query: CallbakcQuery
};

type AppCallback<T extends AppLifecycleUnion> = T extends AppLaunchOrShow ? Callback<AppLaunchOrShowParams> : Callback<CallbakcQuery>;

// for app
export function useAppEvent<T extends AppLifecycleUnion>(eventName: T, callback: AppCallback<T>) {
  const appLifecycle = useContext(AppLifecycleGlobalContext);
  
  useLayoutEffect(() => {
    let clear = appLifecycle?.registerLifecycle(eventName, callback);
    return () => clear?.();
  }, [callback, eventName, appLifecycle]);
}

// for page
export function usePageEvent(eventName: `${PageLifecycle}`, callback: Callback<CallbakcQuery>) {
  const pageLifecycleContext = useContext(PageLifecycleGlobalContext);

  useLayoutEffect(() => {
    let clear = pageLifecycleContext?.registerLifecycle(eventName, callback);
    return () => clear?.();
  }, [callback, eventName, pageLifecycleContext]);
}
