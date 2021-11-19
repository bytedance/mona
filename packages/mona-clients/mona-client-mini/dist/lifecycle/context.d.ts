import React from 'react';
export declare type Callback = (...args: any[]) => any;
export declare enum AppLifecycle {
    lanuch = "lanuch",
    show = "show",
    hide = "hide",
    error = "error",
    pageNodeFound = "pageNodeFound"
}
export declare enum PageLifecycle {
    load = "load",
    ready = "ready",
    show = "show",
    hide = "hide",
    unload = "unload",
    resize = "resize",
    pullDownRefresh = "pullDownRefresh",
    reachBottom = "reachBottom",
    shareAppMessage = "shareAppMessage",
    pageScroll = "pageScroll"
}
export declare class LifecycleContext {
    lifecycles: {
        [key: string]: Callback[];
    };
    constructor();
    registerLifecycle(rawName: string, callback: Callback): void;
}
export declare const PageLifecycleGlobalContext: React.Context<LifecycleContext | null>;
