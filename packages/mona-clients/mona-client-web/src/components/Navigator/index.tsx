import React from 'react';
import { NavigatorProps } from '@bytedance/mona';
import { navigateTo, redirectTo, switchTab, navigateBack } from '../../apis'
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
        navigateTo({ url })
        break;
      case 'redirect':
        redirectTo({ url })
        break;
      case 'switchTab':
        switchTab({ url })
        break;
      case 'reLaunch':
        window.location.reload();
        break;
      case 'navigateBack':
        navigateBack({ delta })
        break;
      default:
        console.error('invalid open type')
    }
    
    onClick(e);
  }

  return <a {...handlerProps} onClick={handleClick} className={handleClassName(styles.nav)}>{children}</a>
}

export default Navigator;
