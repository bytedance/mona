import React from 'react';
import { LifecycleContext, AppLifecycleGlobalContext, AppLifecycle } from '@bytedance/mona';
import render, { batchedUpdates } from '@/reconciler';
import AppTaskController from '@/reconciler/AppTaskController';

class AppConfig {
  private _controller: AppTaskController;
  private _Component: React.ElementType<any>;
  private _pages: any[];
  private _appLifecycleContext: LifecycleContext;
  constructor(Component: React.ComponentType<any>) {
    this._appLifecycleContext = new LifecycleContext();

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
    return render(
      React.createElement(
        AppLifecycleGlobalContext.Provider,
        {
          value: this._appLifecycleContext,
        },
        React.createElement(
          this._Component,
          {},
          this._pages.map((p: any) => p.pageRoot),
        ),
      ),
      this._controller,
    );
  }

  onLaunch(...rest: any[]) {
    this._controller.context = this;
    this._render();
    this._callLifecycle(AppLifecycle.launch, ...rest);
  }

  onShow(...rest: any[]) {
    this._callLifecycle(AppLifecycle.show, ...rest);
  }

  onHide(...rest: any[]) {
    this._callLifecycle(AppLifecycle.hide, ...rest);
  }

  onError(...rest: any[]) {
    this._callLifecycle(AppLifecycle.error, ...rest);
  }

  onPageNotFound(...rest: any[]) {
    this._callLifecycle(AppLifecycle.pageNotFound, ...rest);
  }

  private _callLifecycle(name: AppLifecycle, ...params: any[]) {
    const cbs = this._appLifecycleContext.lifecycle[name] || [];
    cbs.forEach(cb => batchedUpdates(params => cb(...params), params));
  }
}

export default function createApp(Component: React.ComponentType<any>) {
  return new AppConfig(Component);
}
