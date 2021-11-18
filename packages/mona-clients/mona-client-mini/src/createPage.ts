import React from 'react';
import { PageLifecycleGlobalContext, LifecycleContext, PageLifecycle } from './lifecycle/context';
import render from './reconciler';
import PageContainer from './reconciler/TaskController';

interface PageConfig {
  _container: PageContainer;
  _Component: React.ComponentType<any>;
  _pageLifecycleContext: LifecycleContext;
  onLoad: (options: any) => void;
  onUnload: () => void;
  onReady: () => void;
  onShow: (options: any) => void;
  onHide: () => void;
  onResize: () => void;
  onPullDownRefresh: () => void;
  onReachBottom: () => void;
  onShareAppMessage: () => void;
  onPageScroll: () => void;
  $callLifecycle: (name: PageLifecycle, params?: any) => void;
}

function createConfig(Component: React.ComponentType<any>) {

  const config: PageConfig = {
    _pageLifecycleContext: new LifecycleContext(),
    _Component: Component,
    _container: new PageContainer({}),

    onLoad(this: any, options: any) {
      const element = React.createElement(this._Component, {}, []);
      const wrapper = React.createElement(PageLifecycleGlobalContext.Provider, { value: this._pageLifecycleContext }, [element]);

      this._container = new PageContainer(this);
      render(wrapper, this._container);
      this.$callLifecycle(PageLifecycle.load, options);
    },

    onUnload() {
      this.$callLifecycle(PageLifecycle.unload);
    },


    onReady() {
      this.$callLifecycle(PageLifecycle.ready);
    },

    onShow(options: any) {
      this.$callLifecycle(PageLifecycle.show);
    },

    onHide() {
      this.$callLifecycle(PageLifecycle.hide);
    },

    onResize() {
      this.$callLifecycle(PageLifecycle.resize);
    },

    onPullDownRefresh() {
      this.$callLifecycle(PageLifecycle.pullDownRefresh);
    },

    onReachBottom() {
      this.$callLifecycle(PageLifecycle.reachBottom);
    },

    onShareAppMessage() {
      this.$callLifecycle(PageLifecycle.shareAppMessage);
    },

    onPageScroll() {
      this.$callLifecycle(PageLifecycle.pageScroll);
    },

    $callLifecycle(name: PageLifecycle, params?: any) {
      const cbs = this._pageLifecycleContext.lifecycles[name];
      cbs.forEach(cb => {
        cb(params);
      });
    }
  };

  return config;
}

export default function createPage(Component: React.ComponentType<any>) {
  const pageConfig = createConfig(Component);
  return Page(pageConfig);
}