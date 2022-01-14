import * as React from 'react';
import { CUSTOM_REF } from '@bytedance/mona-shared/dist/constants';

export default function createMiniComponent(name: string) {
  const Component = React.forwardRef(({ children, ...props }, ref) => {
    const newProps: any = { ...props };
    // 自定组件ref比较特殊,约定__ref透传react的ref
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
