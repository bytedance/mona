import React from 'react';
export default function createBaseComponent<P, T = any>(name: string): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>>;
