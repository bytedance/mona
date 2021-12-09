import React from 'react';
import { appLifecycleContext } from './lifecycle/hooks';
import { AppLifecycle } from './lifecycle/context';
import render from './reconciler';
// import TaskController from './reconciler/TaskController';
import AppTaskController from './reconciler/AppTaskController';
// import AppTaskController from './reconciler/AppTaskController';

class AppConfig {
  private _controller: AppTaskController;
  private _Component: React.ComponentType<any>;
  private _pages: any[];

  constructor(Component: React.ComponentType<any>) {
    this._Component = Component;
    this._pages = [];
    this._controller = new AppTaskController(this);
  }

  addPage(pageIns: any) {
    this._pages.push(pageIns);
    this._render();
  }
  removePage(pageIns: any) {
    this._pages.splice(this._pages.indexOf(pageIns), 1);
    this._render();
  }

  private _render() {
    console.log('**', this._Component, this._pages);
    return render(
      React.createElement(
        this._Component,
        {},
        this._pages.map((p: any) => p.pageRoot),
      ),
      this._controller,
    );
  }
  onLaunch(options: any) {
    this._controller.context = this;
    this._render();
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
  return new AppConfig(Component);
}
