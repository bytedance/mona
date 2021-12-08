import React from 'react';
import { InputProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Input: React.FC<InputProps> = ({ children, ...restProps }) => {
  const { handleClassName, ...handlerProps} = useHandlers(restProps)
  
  return <input className={handleClassName(styles.input)} {...handlerProps} />
}

export default Input;
