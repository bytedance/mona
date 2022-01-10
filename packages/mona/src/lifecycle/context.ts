import React from 'react';
export type Callback = (...args: any[]) => any;

export enum AppLifecycle {
  launch = 'onLaunch',
  show = 'onShow',
  hide = 'onHide',
  error = 'onError',
  pageNotFound = 'onPageNotFound',
}

export enum PageLifecycle {
  load = 'onLoad',
  ready = 'onReady',
  show = 'onShow',
  hide = 'onHide',
  unload = 'onUnload',
  resize = 'onResize',
  pullDownRefresh = 'onPullDownRefresh',
  reachBottom = 'onReachBottom',
  shareAppMessage = 'onShareAppMessage',
  pageScroll = 'onPageScroll',
}

export enum ComponentLifecycle {
  created = 'onCreated',
  attached = 'onAttached',
  ready = 'onReady',
  moved = 'onMoved',
  detached = 'onDetached',
}
export class LifecycleContext {
  lifecycle: { [key: string]: Callback[] };

  constructor() {
    this.lifecycle = {};
  }

  registerLifecycle(rawName: string, callback: Callback) {
    if (typeof callback !== 'function') {
      return;
    }

    const name = rawName.toLowerCase().replace(/^on/, '');
    this.lifecycle[name] = this.lifecycle[name] || [];
    this.lifecycle[name].push(callback);
  }
}

export const PageLifecycleGlobalContext = React.createContext<LifecycleContext | null>(null);
export const AppLifecycleGlobalContext = React.createContext<LifecycleContext | null>(null);
export const ComponentLifecycleGlobalContext = React.createContext<LifecycleContext | null>(null);
