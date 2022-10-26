import React from 'react';
import './index.module.less';

export function Masking({ onHandle, className = '' }: { onHandle: () => void; className?: string }): JSX.Element {
  return <div className={`mona-web-masking ${className}`} onClick={onHandle} />;
}
