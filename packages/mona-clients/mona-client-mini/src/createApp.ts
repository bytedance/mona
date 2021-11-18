import React from 'react';
import { appLifecycleContext } from './lifecycle/hooks';
import { AppLifecycle } from './lifecycle/context';
import render from './reconciler';

class AppConfig {
  private _container: any;
  private _Component: React.ComponentType<any>;

  constructor(Component: React.ComponentType<any>) {
    this._container = {};
    this._Component = Component;
  }

  onLaunch(options: any) {
    render(React.createElement(this._Component, {}, []), this._container);
    this._callLifecycle(AppLifecycle.lanuch, options);
  }

  onShow(options: any) {
    this._callLifecycle(AppLifecycle.show, options);
  }

  onHide() {
    this._callLifecycle(AppLifecycle.hide);
  }

  onError(msg: string) {
    this._callLifecycle(AppLifecycle.error, msg);
  }

  onPageNotFound(msg: string) {
    this._callLifecycle(AppLifecycle.pageNodeFound, msg);
  }

  private _callLifecycle(name: AppLifecycle, params?: any) {
    const cbs = appLifecycleContext.lifecycles[name];
    cbs.forEach(cb => {
      cb(params);
    });
  }
}

export default function createApp(Component: React.ComponentType<any>) {
  const appConfig = new AppConfig(Component);
  return App(appConfig);
}