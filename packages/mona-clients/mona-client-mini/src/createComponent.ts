import React from 'react';

import { componentLifecycleContext } from '@/lifecycle/context';
import TaskController, { ROOT_KEY } from '@/reconciler/TaskController';
import render from '@/reconciler';


function createConfig(Component: React.ComponentType<any>) {
  // const eventMap = new Map();
  const config: any = {
    _component: Component,
    data: {
      [ROOT_KEY]: {
        COMPLIER_CHILDREN: [],
        COMPLIER_NODES: {},
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
