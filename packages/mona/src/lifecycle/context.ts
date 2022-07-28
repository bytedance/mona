import React from 'react';
export type Callback = (query?: Record<string, string | number | boolean>) => void;

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
  lifecycle: Record<string, Set<Callback>>;

  constructor() {
    this.lifecycle = new Proxy<Record<string, Set<Callback>>>(
      {},
      {
        get: function (target, property) {
          if (typeof property === 'string') {
            return target[property.toLowerCase().replace(/^on/, '')];
          }
          return;
        },
        set: function (target, property, value) {
          if (typeof property === 'string') {
            target[property.toLowerCase().replace(/^on/, '')] = value;
          }
          return true;
        },
      },
    );
  }

  registerLifecycle(name: string, callback: Callback) {
    if (typeof callback !== 'function') {
      return;
    }
    this.lifecycle[name] = this.lifecycle[name] || new Set([]);
    this.lifecycle[name].add(callback);

    return () => {
      this.lifecycle[name].delete(callback);
    };
  }
}

export const PageLifecycleGlobalContext = React.createContext<LifecycleContext | null>(null);
export const AppLifecycleGlobalContext = React.createContext<LifecycleContext | null>(null);
export const ComponentLifecycleGlobalContext = React.createContext<LifecycleContext | null>(null);
