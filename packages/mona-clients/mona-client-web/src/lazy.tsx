import React, { Suspense } from 'react';

export function lazy<T>(factory: () => Promise<{ default: React.ComponentType<T> }>) {
  const Component = React.lazy(factory);
  return (props: T) => (
    <Suspense fallback={'loading...'}>
      <Component {...(props as any)} />
    </Suspense>
  );
}
