import React from 'react';
import { LabelProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Label: React.FC<LabelProps> = ({ children, ...props }) => {
  const { handleClassName, ...handlerProps } = useHandlers(props);

  return <label className={handleClassName(styles.label)} {...handlerProps}>{children}</label>
}

export default Label;
