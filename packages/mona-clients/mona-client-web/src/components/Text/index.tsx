import React from 'react';
import { TextProps } from '@bytedance/mona';
import { useHandlers } from '../hooks';

const Text: React.FC<TextProps> = ({ children, ...restProps }) => {
  const { handleClassName, ...handleProps } = useHandlers(restProps)

  return <span className={handleClassName()} {...handleProps}>{children}</span>
}

export default Text;
