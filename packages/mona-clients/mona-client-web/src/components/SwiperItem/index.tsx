import React from 'react';
import { SwiperItemProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const SwiperItem: React.FC<SwiperItemProps> = ({ children, itemId, ...restProps }) => {
  console.log(restProps);

  const { handleClassName, ...handlerProps} = useHandlers(restProps);

  return <div className={handleClassName(styles.item)} {...handlerProps}>{children}</div>;
}

export default SwiperItem;
