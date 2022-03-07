import React from 'react';
import { LifecycleContext, AppLifecycleGlobalContext, AppLifecycle } from '@bytedance/mona';
import render, { batchedUpdates } from '@/reconciler';
import AppTaskController from '@/reconciler/AppTaskController';
import { isClassComponent } from '@bytedance/mona-shared';

export default function createApp(AppComponent: React.ComponentType<any>) {
  const isClass = isClassComponent(AppComponent);
  const appEntryRef = React.createRef<any>();
  const newConfig = {
    appLifecycleContext: new LifecycleContext(),
    _pages: [] as any[],
    _controller: new AppTaskController({}),

    addPage(pageIns: any) {
      this._pages.push(pageIns);
      this._render();
    },

    removePage(pageIns: any) {
      this._pages.splice(this._pages.indexOf(pageIns), 1);
      this._render();
    },

    _render() {
      return render(
        <AppLifecycleGlobalContext.Provider value={this.appLifecycleContext}>
          <AppComponent ref={isClass ? appEntryRef : undefined}>{this._pages.map((p: any) => p.pageRoot)}</AppComponent>
        </AppLifecycleGlobalContext.Provider>,
        this._controller,
      );
    },

    onLaunch(...rest: any[]) {
      this._controller.context = this;
      this._render();
      this._callLifecycle(AppLifecycle.launch, ...rest);
    },

    onShow(...rest: any[]) {
      this._callLifecycle(AppLifecycle.show, ...rest);
    },

    onHide(...rest: any[]) {
      this._callLifecycle(AppLifecycle.hide, ...rest);
    },

    onError(...rest: any[]) {
      this._callLifecycle(AppLifecycle.error, ...rest);
    },

    onPageNotFound(...rest: any[]) {
      this._callLifecycle(AppLifecycle.pageNotFound, ...rest);
    },

    _callLifecycle(name: AppLifecycle, ...params: any[]) {
      const cbs = this.appLifecycleContext.lifecycle[name] || new Set([]);
      Array.from(cbs).forEach(cb => batchedUpdates(params => cb(...params), params));
      if (appEntryRef.current?.[name]) {
        return appEntryRef.current[name](...params);
      }
    },
  };

  return newConfig;
}
