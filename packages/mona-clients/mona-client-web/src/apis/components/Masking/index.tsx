import React from 'react';
import cs from 'classnames';
import './index.module.less';

export function Masking({ onHandle, className }: { onHandle: () => void; className?: string }): JSX.Element {
  return <div className={cs('mona-web-masking', className || '')} onClick={onHandle} />;
}
