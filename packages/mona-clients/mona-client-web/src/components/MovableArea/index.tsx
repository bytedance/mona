import React, { useEffect, useRef, useState } from 'react';
import { MovableAreaProps } from '@bytedance/mona';
import cs from 'classnames';
import { isElement } from 'react-is';
import styles from './index.module.less';
const MovableArea: React.FC<MovableAreaProps> = ({ scaleArea = false, children, className, style }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [{ wrapperWidth, wrapperHeight }, setWrapper] = useState({ wrapperWidth: 0, wrapperHeight: 0 });
  useEffect(() => {
    setWrapper({
      wrapperWidth: wrapperRef.current!.clientWidth,
      wrapperHeight: wrapperRef.current!.clientHeight,
    });
  }, []);

  if (isElement(children) && children?.props) {
    return (
      <div ref={wrapperRef} className={cs(className, styles.wrapper)} style={style}>
        {React.cloneElement(children, { scaleArea, wrapperRef, wrapperWidth, wrapperHeight })}
      </div>
    );
  }
  return null;
};

export default MovableArea;
