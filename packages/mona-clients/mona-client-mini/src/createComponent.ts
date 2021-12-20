import React from 'react';

import { componentLifecycleContext } from '@/lifecycle/context';
import TaskController, { ROOT_KEY } from '@/reconciler/TaskController';
import render from '@/reconciler';

// export interface OtherOption {
//   behaviors?: string[];
//   relations?: Record<string, any>;
//   options?: Record<string, any>;
//   definitionFilter?: Function;
// }
// export interface Lifetimes {
//   created?: () => void;

//   attached?: () => void;

//   ready?: () => void;
//   moved?: () => void;
//   detached?: () => void;
// }
// interface FullProperty {
//   /** 属性类型 */
//   type: any;
//   /** 属性初始值 */
//   value?: any;
//   /** 属性值被更改时的响应函数 */
//   observer?: string | ((newVal: any, oldVal: any, changedPath: (string | number)[]) => void);
//   /** 属性的类型（可以指定多个） */
//   optionalTypes?: any[];
// }
// type ComponentConfig = {
//   _controller: TaskController;
//   _component: React.ComponentType<any>;

//   methods: Record<string, any>;
//   properties: FullProperty;
//   render: any;
// } & Partial<Lifetimes> &
//   Partial<OtherOption>;

function createConfig(Component: React.ComponentType<any>) {
  // const eventMap = new Map();
  const config: any = {
    _component: Component,
    data: {
      [ROOT_KEY]: {
        children: [],
        nodes: {},
      },
    },
    properties: {},
    attached() {
      this.init();
    },
    detached() {
      this._controller.stopUpdate();
      render(null, this._controller);
    },
    methods: {
      init(this: any) {
        this._controller = new TaskController(this);
        this.componentRoot = render(
          React.createElement(componentLifecycleContext.Provider, { value: this }, [
            React.createElement(this._component, this.properties),
          ]),
          this._controller,
        );
      },
    },
  };

  return config;
}

export default function createComponent(Component: React.ComponentType<any>) {
  return createConfig(Component);
}
