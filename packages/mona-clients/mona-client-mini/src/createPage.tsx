import React from 'react';
import { Portal } from 'react-is';
import { stringifySearch } from '@bytedance/mona-shared';
import { PageLifecycleGlobalContext, LifecycleContext, PageLifecycle } from '@bytedance/mona';
import TaskController, { ROOT_KEY } from '@/reconciler/TaskController';
import render, { batchedUpdates } from '@/reconciler';
import { generateId } from './reconciler/ServerElement';
import { isClassComponent } from '@bytedance/mona-shared';

// in order to share react runtime
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
  onResize: (e: any) => void;
  onPullDownRefresh: (e: any) => void;
  onReachBottom: () => void;
  onShareAppMessage: (options: { channel?: string }) => void;
  onPageScroll: (e: any) => void;

  $callLifecycle: (name: PageLifecycle, params?: any) => void;
  [key: string]: any;
}

let pageId = 0;

function generatePageId(pre?: string) {
  pageId++;
  return `page_${pre ?? ''}${pageId}`;
}

function createConfig(PageComponent: React.ComponentType<any>) {
  let app: any;
  try {
    app = getApp();
  } catch (e) {
    app = null;
  }
  const isClass = isClassComponent(PageComponent);
  const pageEntryRef = React.createRef<any>();
  // const eventMap = new Map();
  const config: PageConfig = {
    _pageLifecycleContext: new LifecycleContext(),
    _Component: PageComponent,
    _controller: new TaskController({}),

    onLoad(options: any) {
      // monaPrint.log('onLoad', this, options);
      this.data = {
        [ROOT_KEY]: {
          COMPLIER_CHILDREN: [],
          COMPLIER_NODES: {},
        },
      };

      this._controller = new TaskController(this);

      const wrapper = (
        <PageLifecycleGlobalContext.Provider value={this._pageLifecycleContext}>
          <PageComponent
            key={generateId()}
            search={stringifySearch(options)}
            searchParams={options}
            ref={isClass ? pageEntryRef : undefined}
          />
        </PageLifecycleGlobalContext.Provider>
      );

      this.pageRoot = createPortal(wrapper, this._controller, generatePageId());

      if (app) {
        app.addPage(this);
        // When subcontracting independently，getApp() === undefined
      } else {
        render(wrapper, this._controller);
      }

      this.$callLifecycle(PageLifecycle.load, options);
    },

    onUnload(...rest) {
      this._controller.stopUpdate();
      this.$callLifecycle(PageLifecycle.unload, ...rest);
      app?.removePage(this);
    },

    onReady(...params: any[]) {
      this.$callLifecycle(PageLifecycle.ready, ...params);
    },

    onShow(...params: any[]) {
      this.$callLifecycle(PageLifecycle.show, ...params);
    },

    onHide(...params: any[]) {
      this.$callLifecycle(PageLifecycle.hide, ...params);
    },

    onResize(...params: any[]) {
      this.$callLifecycle(PageLifecycle.resize, ...params);
    },

    onPullDownRefresh(...params: any[]) {
      this.$callLifecycle(PageLifecycle.pullDownRefresh, ...params);
    },

    onReachBottom(...params: any[]) {
      this.$callLifecycle(PageLifecycle.reachBottom, ...params);
    },

    onShareAppMessage(...params: any[]) {
      this.$callLifecycle(PageLifecycle.shareAppMessage, ...params);
    },

    onPageScroll(...params: any[]) {
      this.$callLifecycle(PageLifecycle.pageScroll, ...params);
    },

    $callLifecycle(name: PageLifecycle, ...params: any[]) {
      const cbs = this._pageLifecycleContext.lifecycle[name] || [];
      cbs.forEach(cb => batchedUpdates(params => cb(...params), params));
      if (pageEntryRef.current?.[name]) {
        return pageEntryRef.current[name](...params);
      }
    },
  };

  return config;
}

export default function createPage(Component: React.ComponentType<any>) {
  return createConfig(Component);
}
