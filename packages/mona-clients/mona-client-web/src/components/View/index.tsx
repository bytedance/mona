import React from 'react';
import { ViewProps } from '@bytedance/mona';
import { useHandlers } from '../hooks';

const View: React.FC<ViewProps> = (props) => {
  const { children, ...restProps } = props;
  
  const { handleClassName, ...handlerProps } = useHandlers(restProps);
  return <div className={handleClassName()} {...handlerProps}>{children}</div>
}

export default View;
