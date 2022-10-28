import React from 'react';
import { IconProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Icon: React.FC<IconProps> = props => {
  const { children, type, size = 24, color, ...restProps } = props;
  const { handleClassName, ...handleProps } = useHandlers(restProps);

  return (
    <div className={handleClassName(styles.container)} {...handleProps}>
      <i className={`${styles.icon} ${!!type ? styles[type] : ''}`} style={{ color, fontSize: size }}></i>
    </div>
  );
};

export default Icon;
