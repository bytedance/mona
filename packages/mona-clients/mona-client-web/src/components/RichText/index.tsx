import React from 'react';
import { RichTextProps } from '@bytedance/mona';

const RichText: React.FC<RichTextProps> = ({ children }) => {
  return <div>{children}</div>
}

export default RichText;
