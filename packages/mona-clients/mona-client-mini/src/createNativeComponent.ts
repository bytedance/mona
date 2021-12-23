import * as React from 'react';

export default function createNativeComponent(name: string) {
  const Component = React.forwardRef(({ children, ...props }, ref) => {
    const newProps: any = { ...props };
    newProps.__ref =
      typeof ref === 'function'
        ? ref
        : (e: any) => {
            ref && (ref.current = e);
          };
    return React.createElement(name, newProps, children);
  });
  Component.displayName = name;
  return Component;
}
