import * as React from 'react';
import { CUSTOM_REF } from '@bytedance/mona-shared';

export default function createMiniComponent(name: string) {
  const Component = React.forwardRef(({ children, ...props }, ref) => {
    const newProps: any = { ...props };
    // The attribute ref of custom components is special， It is agreed that the ref of react is passed through __ref
    // https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/custom-component/ref/
    newProps[CUSTOM_REF] =
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
