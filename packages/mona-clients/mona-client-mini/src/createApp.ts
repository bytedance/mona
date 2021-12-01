import React from 'react';
import { appLifecycleContext } from './lifecycle/hooks';
import { AppLifecycle } from './lifecycle/context';
import render from './reconciler';
import TaskController from './reconciler/TaskController';
import AppTaskController from './reconciler/AppTaskController';
// import AppTaskController from './reconciler/AppTaskController';

class AppConfig {
  private _controller?: TaskController;
  private _Component: React.ComponentType<any>;

  constructor(Component: React.ComponentType<any>) {
    this._Component = Component;
  }

  onLaunch(options: any) {
    this._controller = new AppTaskController(this);
    //@ts-ignore
    render(React.createElement(this._Component, null, []), this._controller);
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
    const cbs = appLifecycleContext.lifecycles[name] || [];
    cbs.forEach(cb => {
      cb(params);
    });
  }
}

export default function createApp(Component: React.ComponentType<any>) {
  const appConfig = new AppConfig(Component);
  return App(appConfig);
}
