import React from 'react';
import { IconProps } from '@bytedance/mona';
import cs from 'classnames';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Icon: React.FC<IconProps> = (props) => {
  const { children, type, size = 24, color, ...restProps } = props;
  const { handleClassName, ...handleProps } = useHandlers(restProps);

  return (
    <div className={handleClassName(styles.container)} {...handleProps}>
      <i className={cs(styles.icon, { [styles[type]]: !!type })} style={{ color, fontSize: size }}></i>
    </div>
  )
}

export default Icon;
