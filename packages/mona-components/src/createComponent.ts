import React from 'react';

export default function createComponent<P, T = any>(name: string) {
  const Component = React.forwardRef<T, P>(({ children, ...props }, ref) => (React.createElement(name, { ...props, ref }, children)));
  Component.displayName = name;
  return Component;
}