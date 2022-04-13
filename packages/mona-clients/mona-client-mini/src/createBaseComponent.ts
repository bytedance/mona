import React from 'react';

export default function createBaseComponent<P>(name: string) {
  const Component = React.forwardRef<any, any>(({ children, ...props }, ref) =>
    React.createElement(name, { ...props, ref }, children),
  );
  Component.displayName = name;
  return Component as React.ComponentType<P>;
}
