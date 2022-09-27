import { useState, useRef, useEffect } from 'react';
import { BaseProps, HoverProps, Touch } from '@bytedance/mona';
import { formatMouseEvent, formatTouchEvent, formatTransitionEvent, formatAnimationEvent } from './utils';

const LONG_DURATION = 350;
const HOVER_START_TIME = 20;
const HOVER_STAY_TIME = 70;

function isFunc(val: any): val is Function {
  return typeof val === 'function';
}

export function useHandlers(props: BaseProps<Touch> & HoverProps) {
  const {
    onTouchStart,
    onTouchMove,
    onTouchCancel,
    onTouchEnd,
    onTap,
    onLongPress,
    onLongTap,
    onTransitionEnd,
    onAnimationStart,
    onAnimationIteration,
    onAnimationEnd,
    // no implement
    onTouchForceChange,
    // catchEvents
    catchTouchStart,
    catchTouchMove,
    catchTouchCancel,
    catchTouchEnd,
    catchTap,
    catchLongPress,
    catchLongTap,
    catchTransitionEnd,
    catchAnimationStart,
    catchAnimationIteration,
    catchAnimationEnd,
    // no implement
    catchTouchForceChange,
    className,
    hoverClassName = '',
    hoverStartTime = HOVER_START_TIME,
    hoverStayTime = HOVER_STAY_TIME,
    ...restProps
  } = props;

  const [isHover, setIsHover] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoverRef = useRef(false);
  const shouldEmitLongEventRef = useRef(false);

  const delay = (callback: () => void, time: number) => {
    timersRef.current.push(
      setTimeout(() => {
        callback();
      }, time),
    );
  };

  const stop = () => {
    hoverRef.current = false;

    delay(() => {
      hoverClassName && isHover && setIsHover(false);
    }, hoverStayTime);
  };

  useEffect(() => () => timersRef.current.forEach(t => clearTimeout(t)), []);

  const handleTouchStart = (e: React.TouchEvent) => {
    hoverRef.current = true;
    shouldEmitLongEventRef.current = false;

    delay(() => {
      hoverClassName && hoverRef.current && setIsHover(true);
    }, hoverStartTime);

    delay(() => {
      // simulate long press
      if (hoverRef.current) {
        shouldEmitLongEventRef.current = true;
      }
    }, LONG_DURATION);

    const event = formatTouchEvent({ event: e });
    isFunc(onTouchStart) && onTouchStart(event);
    if (isFunc(catchTouchStart)) {
      e.stopPropagation();
      catchTouchStart(event);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    stop();

    const event = formatTouchEvent({ event: e });
    isFunc(onTouchMove) && onTouchMove(event);
    if (isFunc(catchTouchMove)) {
      e.stopPropagation();
      catchTouchMove(event);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    stop();

    const event = formatTouchEvent({ event: e });
    isFunc(onTouchEnd) && onTouchEnd(event);
    if (isFunc(catchTouchEnd)) {
      e.stopPropagation();
      catchTouchEnd(event);
    }
    if (shouldEmitLongEventRef.current) {
      const longTapEvent = formatTouchEvent({ event: e, type: 'longtap' });
      isFunc(onLongTap) && onLongTap(longTapEvent);
      if (isFunc(catchLongTap)) {
        e.stopPropagation();
        catchLongTap(longTapEvent);
      }
      const longPressEvent = formatTouchEvent({ event: e, type: 'longpress' });
      if (isFunc(onLongPress)) {
        onLongPress(longPressEvent);
      }
      if (isFunc(catchLongPress)) {
        e.stopPropagation();
        catchLongPress(longPressEvent);
      }
    }
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    stop();

    const event = formatTouchEvent({ event: e });
    isFunc(onTouchCancel) && onTouchCancel(event);
    if (isFunc(catchTouchCancel)) {
      e.stopPropagation();
      catchTouchCancel(event);
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    // if longPressEvent already emited, this event will not emit
    if (!(shouldEmitLongEventRef.current && isFunc(onLongPress))) {
      const event = formatMouseEvent({ event: e, type: 'tap' });
      isFunc(onTap) && onTap(event);
      if (isFunc(catchTap)) {
        e.stopPropagation();
        catchTap(event);
      }
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    const event = formatTransitionEvent({ event: e });
    isFunc(onTransitionEnd) && onTransitionEnd(event);
    if (isFunc(catchTransitionEnd)) {
      e.stopPropagation();
      catchTransitionEnd(event);
    }
  };

  const handleAnimationStart = (e: React.AnimationEvent) => {
    const event = formatAnimationEvent({ event: e });
    isFunc(onAnimationStart) && onAnimationStart(event);
    if (isFunc(catchAnimationStart)) {
      e.stopPropagation();
      catchAnimationStart(event);
    }
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    const event = formatAnimationEvent({ event: e });
    isFunc(onAnimationEnd) && onAnimationEnd(event);
    if (isFunc(catchAnimationEnd)) {
      e.stopPropagation();
      catchAnimationEnd(event);
    }
  };

  const handleAnimationIteration = (e: React.AnimationEvent) => {
    const event = formatAnimationEvent({ event: e });
    isFunc(onAnimationIteration) && onAnimationIteration(event);
    if (isFunc(catchAnimationIteration)) {
      e.stopPropagation();
      catchAnimationIteration(event);
    }
  };

  const handleClassName = (name?: string | string[]) => {
    if (Array.isArray(name)) {
      name = name.filter(n => n).join(' ');
    }
    return `${name ?? ''} ${className ?? ''} ${hoverClassName && isHover ? hoverClassName : ''} `;
  };

  return {
    onClick: handleTap,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onTouchCancel: handleTouchCancel,
    onTransitionEnd: handleTransitionEnd,
    onAnimationStart: handleAnimationStart,
    onAnimationIteration: handleAnimationIteration,
    onAnimationEnd: handleAnimationEnd,
    // no implemented
    // onTouchForceChange: undefined,
    handleClassName,
    ...restProps,
  };
}
