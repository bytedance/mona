import React from 'react';
import { TextareaProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Textarea: React.FC<TextareaProps> = ({ children, ...restProps }) => {
  const { handleClassName, ...handlerProps} = useHandlers(restProps)
  
  return <textarea className={handleClassName(styles.textarea)} {...handlerProps} />
}

export default Textarea;
