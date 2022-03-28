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
    hoverStartTime = 20,
    hoverStayTime = 70,
    // not implemented
    openType,
    // not implemented
    onGetPhoneNumber,
    ...restProps
  } = props;

  const { handleClassName, ...handlerProps } = useHandlers({ ...restProps, hoverStartTime, hoverStayTime });

  const className = handleClassName(styles.button);

  return (
    <button
      className={className}
      type={formType}
      data-mona-type={type}
      data-mona-size={size}
      data-mona-loading={!!loading}
      {...handlerProps}
    >{children}</button>
  )
}

export default Button;
