// TODO: rewrite this component
import React, { useEffect, useRef } from 'react';
import { SwiperProps } from '@bytedance/mona';
import cs from 'classnames';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { useSlide, useTouch } from './hooks';

function findIndexFromItemId(children: React.ReactNode, itemId: string) {
  let resultIndex = 0;
  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child) && child.props.itemId === itemId) {
      resultIndex = index;
    }
  });
  return resultIndex;
}

const Swiper: React.FC<SwiperProps> = props => {
  const {
    children,
    indicatorDots = false,
    indicatorColor = 'rgba(0, 0, 0, .3)',
    indicatorActiveColor = 'rgba(0, 0, 0, 1)',
    autoplay = false,
    current = 0,
    currentItemId = '',
    interval = 5000,
    previousMargin = '',
    nextMargin = '',
    displayMultipleItems = 1,
    duration = 500,
    circular = false,
    vertical = false,
    onChange,
    // not implemented
    onAnimationFinish,
    // not implemented
    onTransition,
    ...restProps
  } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);

  const { handleClassName, ...handleProps } = useHandlers(restProps);

  const total = React.Children.count(children);
  const currentIndex = currentItemId ? findIndexFromItemId(children, currentItemId) : current;

  const { next, prev, wrapperRef, activeIndex } = useSlide({
    current: currentIndex,
    total,
    vertical,
    duration,
    circular,
    onChange,
  });

  const touchParams = {
    left: vertical ? null : (e: React.TouchEvent) => next(false, e),
    right: vertical ? null : (e: React.TouchEvent) => prev(false, e),
    top: vertical ? (e: React.TouchEvent) => next(false, e) : null,
    bottom: vertical ? (e: React.TouchEvent) => prev(false, e) : null,
    duration,
  };
  const { handleTouchStart, handleTouchMove } = useTouch(touchParams);

  // autoplay
  useEffect(() => {
    if (!total) {
      return;
    }
    if (autoplay) {
      const timer = setInterval(() => {
        next(true);
      }, interval);

      return () => clearInterval(timer);
    }
    return () => {};
  }, [autoplay, interval, next, total]);

  if (!total) {
    return null;
  }

  return (
    <div ref={ref} {...handleProps} className={handleClassName(styles.swiper)}>
      <div
        ref={wrapperRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={cs(vertical ? styles['vertical-wrapper'] : styles.wrapper)}
        style={{ transitionDuration: '0ms', transform: 'translate3d(10px, 0px, 0px)' }}
      >
        {children}
      </div>
      {indicatorDots && (
        <div className={cs(styles.dots, { [styles.horizontal]: !vertical })} ref={dotsRef}>
          {(function () {
            const result = [];
            for (let i = 0; i < total; i++) {
              result.push(
                <span
                  className={styles.dot}
                  style={{ backgroundColor: activeIndex === i ? indicatorActiveColor : indicatorColor }}
                  key={i}
                ></span>
              );
            }
            return result;
          })()}
        </div>
      )}
    </div>
  );
};

export default Swiper;
