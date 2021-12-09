import React from 'react';
import { NavigatorProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Navigator: React.FC<NavigatorProps> = (props) => {
  const {
    children,
    url,
    delta = 1,
    openType = 'navigate',
    hoverStartTime = 50,
    hoverStayTime = 400,
    ...restProps
  } = props;

  const { handleClassName, onClick, ...handlerProps } = useHandlers({ ...restProps, hoverClassName: styles.hover, hoverStayTime, hoverStartTime });

  const handleClick = (e: React.MouseEvent) => {
    switch (openType) {
      case 'navigate':
        window.history.pushState({}, '', url);
        break;
      case 'redirect':
        window.history.replaceState({}, '', url);
        break;
      // TODO: implement tab
      case 'switchTab':
        console.warn('not implement switchTab in web now')
        break;
      case 'reLaunch':
        window.history.go(-(history.length - 1))
        window.history.pushState({}, '', url);
        break;
      case 'navigateBack':
        window.history.go(-delta);
    }
    
    onClick(e);
  }

  return <div {...handlerProps} onClick={handleClick} className={handleClassName(styles.nav)}>{children}</div>
}

export default Navigator;
