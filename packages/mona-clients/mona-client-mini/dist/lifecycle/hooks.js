import { useLayoutEffect, useContext } from 'react';
import { LifecycleContext, PageLifecycleGlobalContext } from './context';
// for app
export var appLifecycleContext = new LifecycleContext();
export function useAppEvent(eventName, callback) {
    useLayoutEffect(function () {
        appLifecycleContext.registerLifecycle(eventName, callback);
    });
}
// for page
export function usePageEvent(eventName, callback) {
    var pageLifecycleContext = useContext(PageLifecycleGlobalContext);
    useLayoutEffect(function () {
        if (pageLifecycleContext) {
            pageLifecycleContext.registerLifecycle(eventName, callback);
        }
    });
}
//# sourceMappingURL=hooks.js.map