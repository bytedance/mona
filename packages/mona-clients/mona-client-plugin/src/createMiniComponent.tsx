import * as React from 'react';

export function createMiniComponent(name: string) {
  // forwardRef只是为了避免传ref保存
  const Component = React.forwardRef(({ children, ...props }) => React.createElement(name, { ...props }, children));
  Component.displayName = name;
  return Component;
}
