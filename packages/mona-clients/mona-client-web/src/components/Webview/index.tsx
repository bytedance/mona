import React from 'react';
import { WebviewProps } from '@bytedance/mona';

const Webview: React.FC<WebviewProps> = ({ children }) => {
  return <div>{children}</div>
}

export default Webview;
