import { useState, useRef, useEffect } from 'react';
import { BaseProps, HoverProps, Touch } from '@bytedance/mona';
import cs from 'classnames';
import { formatMouseEvent, formatTouchEvent } from './utils';

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
    className,
    hoverClassName = '',
    hoverStartTime,
    hoverStayTime,
    ...restProps
  } = props;

  const [isHover, setIsHover] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const hoverRef = useRef(false);
  const shouldEmitLongEventRef = useRef(false);

  const delay = (callback: () => void, time: number) => {
    timersRef.current.push(
      setTimeout(() => {
        callback();
      }, time)
    )
  }

  const stop = () => {
    hoverRef.current = false;

    delay(() => {
      hoverClassName && isHover && setIsHover(false);
    }, HOVER_STAY_TIME)
  }

  useEffect(() => () => timersRef.current.forEach(t => clearTimeout(t)), [])

  const handleTouchStart = (e: React.TouchEvent) => {
    hoverRef.current = true;
    shouldEmitLongEventRef.current = false;

    delay(() => {
      hoverClassName && hoverRef.current && setIsHover(true);
    }, HOVER_START_TIME)

    delay(() => {
      // simulate long press
      if (hoverRef.current) {
        shouldEmitLongEventRef.current = true;
      }
    }, LONG_DURATION)

    isFunc(onTouchStart) && onTouchStart(formatTouchEvent({ event: e }));
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    stop();

    const event = formatTouchEvent({ event: e });
    isFunc(onTouchMove) && onTouchMove(event);
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    stop();

    const event = formatTouchEvent({ event: e });
    isFunc(onTouchEnd) && onTouchEnd(event);
    if (shouldEmitLongEventRef.current) {
      isFunc(onLongTap) && onLongTap(formatTouchEvent({ event: e, type: 'longtap' }));
      if (isFunc(onLongPress)) {
        onLongPress(formatTouchEvent({ event: e, type: 'longpress' }));
      }
    }
  }

  const handleTouchCancel = (e: React.TouchEvent) => {
    stop();
    
    const event = formatTouchEvent({ event: e });
    isFunc(onTouchCancel) && onTouchCancel(event);
  }

  const handleTap = (e: React.MouseEvent) => {
    // if longPressEvent already emited, this event will not emit
    if (!(shouldEmitLongEventRef.current && isFunc(onLongPress))) {
      isFunc(onTap) && onTap(formatMouseEvent({ event: e, type: 'tap' }));
    }
  }

  const handleClassName = (name?: string | string[]) => cs(name, className, { [hoverClassName]: hoverClassName && isHover })

  return {
    onClick: handleTap,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onTouchCancel: handleTouchCancel,
    onTransitionEnd: (e: any) => isFunc(onTransitionEnd) && onTransitionEnd(e),
    onAnimationStart: (e: any) => isFunc(onAnimationStart) && onAnimationStart(e),
    onAnimationIteration: (e: any) => isFunc(onAnimationIteration) && onAnimationIteration(e),
    onAnimationEnd: (e: any) => isFunc(onAnimationEnd) && onAnimationEnd(e),
    // no implemented
    // onTouchForceChange: undefined,
    handleClassName,
    ...restProps,
  }
}