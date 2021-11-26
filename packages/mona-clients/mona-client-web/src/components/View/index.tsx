import React from 'react';
import { ViewProps } from '@bytedance/mona';

const View: React.FC<ViewProps> = ({ children }) => {
  return <div>{children}</div>
}

export default View;
