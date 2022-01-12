import * as React from 'react';

export function createNativeComponent(name: string) {
  const ChildrenComponent: React.FC = ({ children }) => {
    return <>{children}</>;
  };
  ChildrenComponent.displayName = name;
  return ChildrenComponent;
}
