import React from 'react';
import { PageLifecycleGlobalContext, LifecycleContext, PageLifecycle } from './lifecycle/context';
// import render from './reconciler';
import TaskController, { ROOT_KEY } from './reconciler/TaskController';
import { Portal } from 'react-is';
import { EventMap, genEventHandler } from './reconciler/eventHandler';
import render from './reconciler';

export function createPortal(children: React.ReactNode, containerInfo: any, key?: string): any {
  return {
    $$typeof: Portal,
    key: key == null ? null : String(key),
    children,
    containerInfo,
    implementation: null,
  };
}

interface PageConfig {
  _controller: TaskController;
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
  onShareAppMessage: (options: { channel?: string }) => void;
  onPageScroll: () => void;
  $callLifecycle: (name: PageLifecycle, params?: any) => void;
  eventHandler: ReturnType<typeof genEventHandler>;
  eventMap: EventMap;
}
let pageId = 0;

function generatePageId(pre?: string) {
  pageId++;
  return `page_${pre ?? ''}${pageId}`;
}
function createConfig(Component: React.ComponentType<any>) {
  let app: any;
  try {
    app = getApp();
  } catch (e) {
    app = null;
  }
  const eventMap = new Map();
  const config: PageConfig = {
    _pageLifecycleContext: new LifecycleContext(),
    _Component: Component,
    _controller: new TaskController({}),

    eventHandler: genEventHandler(eventMap),
    eventMap: eventMap,
    onLoad(this: any, options: any) {
      this.data = {
        [ROOT_KEY]: {
          children: [],
          nodes: {},
        },
      };

      this._controller = new TaskController(this);

      const wrapper = React.createElement(
        PageLifecycleGlobalContext.Provider,
        { value: this._pageLifecycleContext, key: generatePageId() },
        [React.createElement(this._Component, { key: 'entry' }, [])],
      );
      this.pageRoot = createPortal(wrapper, this._controller, generatePageId());

      if (app) {
        app.addPage(this);
      } else {
        // 独立分包时，getApp() === undefined
        render(wrapper, this._controller);
      }

      this.$callLifecycle(PageLifecycle.load, options);
    },

    onUnload() {
      this._controller.stopUpdate();
      this.$callLifecycle(PageLifecycle.unload);
      if (app) {
        app.removePage(this);
      }
    },

    onReady() {
      this.$callLifecycle(PageLifecycle.ready);
    },

    onShow(options: any) {
      this.$callLifecycle(PageLifecycle.show, options);
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

    onShareAppMessage(options) {
      this.$callLifecycle(PageLifecycle.shareAppMessage, options);
    },

    onPageScroll() {
      this.$callLifecycle(PageLifecycle.pageScroll);
    },

    $callLifecycle(name: PageLifecycle, params?: any) {
      const cbs = this._pageLifecycleContext.lifecycles[name] || [];
      cbs.forEach(cb => {
        cb(params);
      });
    },
  };

  return config;
}

export default function createPage(Component: React.ComponentType<any>) {
  return createConfig(Component);
}
