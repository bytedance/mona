import React from 'react';
export type Callback = (...args: any[]) => any;

export enum AppLifecycle {
  launch = 'launch',
  show = 'show',
  hide = 'hide',
  error = 'error',
  pageNotFound = 'pageNotFound',
}

export enum PageLifecycle {
  load = 'load',
  ready = 'ready',
  show = 'show',
  hide = 'hide',
  unload = 'unload',
  resize = 'resize',
  pullDownRefresh = 'pullDownRefresh',
  reachBottom = 'reachBottom',
  shareAppMessage = 'shareAppMessage',
  pageScroll = 'pageScroll',
}

export class LifecycleContext {
  lifecycles: { [key: string]: Callback[] };

  constructor() {
    this.lifecycles = {};
  }

  registerLifecycle(rawName: string, callback: Callback) {
    if (typeof callback !== 'function') {
      return;
    }

    const name = rawName.toLowerCase().replace(/^on/, '');
    this.lifecycles[name] = this.lifecycles[name] || [];
    this.lifecycles[name].push(callback);
  }
}

export const PageLifecycleGlobalContext = React.createContext<LifecycleContext | null>(null);
export const appLifecycleContext = React.createContext<LifecycleContext | null>(null);
