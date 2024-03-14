import React, { Suspense } from 'react';
import { Loading } from './components/Loading';

export function lazy<T>(factory: () => Promise<{ default: React.ComponentType<T> }>) {
  const Component = React.lazy(factory);
  return (props: T) => (
    <Suspense fallback={null}>
      <Component {...(props as any)} />
    </Suspense>
  );
}
