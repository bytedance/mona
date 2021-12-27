import React, { useEffect, useRef, useState } from 'react';
import { MovableAreaProps } from '@bytedance/mona';
import { isElement } from 'react-is';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
const MovableArea: React.FC<MovableAreaProps> = ({ scaleArea = false, children, className, style, ...restProps }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [{ wrapperWidth, wrapperHeight }, setWrapper] = useState({ wrapperWidth: 0, wrapperHeight: 0 });
  useEffect(() => {
    setWrapper({
      wrapperWidth: wrapperRef.current!.clientWidth,
      wrapperHeight: wrapperRef.current!.clientHeight,
    });
  }, []);
  const { handleClassName, ...handlerProps } = useHandlers(restProps);

  if (isElement(children) && children?.props) {
    return (
      <div ref={wrapperRef} className={handleClassName([className, styles.wrapper])} style={style} {...handlerProps}>
        {React.cloneElement(children, { scaleArea, wrapperRef, wrapperWidth, wrapperHeight })}
      </div>
    );
  }
  return null;
};

export default MovableArea;
