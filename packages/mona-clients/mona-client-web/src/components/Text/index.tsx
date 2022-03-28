import React from 'react';
import { TextProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

// TODO: to finish
const Text: React.FC<TextProps> = ({ children, selectable, space, decode, ...restProps }) => {
  const { handleClassName, ...handleProps } = useHandlers(restProps)

  return <span className={handleClassName(selectable ? '' : styles.noselectable)} {...handleProps}>{children}</span>
}

export default Text;
