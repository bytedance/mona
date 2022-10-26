import React, { useEffect, useRef, useState } from 'react';
import { ProgressProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

function format(percent: number) {
  return percent < 0 ? 0 : percent > 100 ? 100 : percent;
}

const Progress: React.FC<ProgressProps> = props => {
  const {
    percent = 0,
    strokeWidth = 6,
    color = '#F85959',
    activeColor = '#F85959',
    backgroundColor = '#ebebeb',
    active = false,
    activeMode = 'backwards',
    style = {},
    ...restProps
  } = props;
  const eleRef = useRef<HTMLDivElement | null>(null);
  const gapRef = useRef(0);
  const prevRef = useRef(0);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (activeMode === 'forwards') {
      gapRef.current = Math.abs(format(percent) - prevRef.current);
      setP(format(percent));
    } else {
      gapRef.current = 0;
      setP(0);
      setTimeout(() => {
        gapRef.current = format(percent);
        setP(format(percent));
      }, 0);
    }
    prevRef.current = format(percent);
  }, [percent]);

  const { handleClassName, ...handleProps } = useHandlers(restProps);
  // const gap = percent - prevRef.current;

  return (
    <div
      className={handleClassName(styles.progress)}
      style={{ ...style, backgroundColor, height: strokeWidth }}
      {...handleProps}
    >
      <div
        ref={eleRef}
        className={`${styles.inner} ${active ? styles.active : ''}`}
        style={{
          width: `${p}%`,
          backgroundColor: activeColor || color,
          transitionDuration: `${gapRef.current * 30}ms`,
        }}
      ></div>
    </div>
  );
};

export default Progress;
