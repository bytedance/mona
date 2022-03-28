import React from 'react';
export function isClassComponent(Component: any): Component is React.ComponentClass {
  return typeof Component.prototype?.render === 'function' && Component?.prototype?.isReactComponent;
}
