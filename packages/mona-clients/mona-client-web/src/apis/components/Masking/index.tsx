import React from 'react';
import './index.css';

export function Masking({ onHandle }: { onHandle: () => void }): JSX.Element {
  return <div className="mona-web-masking" onClick={onHandle} />;
}
