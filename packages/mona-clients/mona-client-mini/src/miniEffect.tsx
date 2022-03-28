import React, { useLayoutEffect } from 'react';
type Listener = (...args: any) => void;

class MiniEffect {
  listeners: { listener: Listener; once?: boolean }[];

  constructor() {
    this.listeners = [];
  }

  remove(listener: Listener) {
    this.listeners = this.listeners.filter(l => l.listener !== listener);
  }

  add(listener: Listener, once: boolean) {
    this.listeners.push({ listener, once });
    return () => this.remove(listener);
  }

  run() {
    this.listeners.forEach(l => {
      if (typeof l.listener === 'function') {
        l.listener();
      }
      l.once && this.remove(l.listener);
    });
  }
}
export const miniEffect = new MiniEffect();

export function useMiniEffect(listener: Listener, deps?: React.DependencyList) {
  useLayoutEffect(() => {
    return miniEffect.add(listener, !!deps);
  }, deps);
}
