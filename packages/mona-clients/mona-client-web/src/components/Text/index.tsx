import React from 'react';
import { TextProps } from '@bytedance/mona';

const Text: React.FC<TextProps> = ({ children }) => {
  return <div>{children}</div>
}

export default Text;
