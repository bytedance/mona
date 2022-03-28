import * as React from 'react';

export function createMiniComponent(name: string) {
  // forwardRef 只为避免传ref时，控制台报错。
  const Component = React.forwardRef(({ children }, _ref) => <>{children}</>);
  Component.displayName = name;
  return Component;
}
