import React from 'react';
import { ButtonProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    type,
    formType,
    loading,
    size = "default",
    // not implemented
    openType,
    // not implemented
    onGetPhoneNumber,
    ...restProps
  } = props;

  const { handleClassName, ...handlerProps } = useHandlers(restProps);

  return (
    <button
      className={handleClassName(styles.button)}
      type={formType}
      data-mona-type={type}
      data-mona-size={size}
      data-mona-loading={!!loading}
      {...handlerProps}
    >{children}</button>
  )
}

export default Button;
