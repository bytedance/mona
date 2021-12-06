import { useState, useRef, useEffect } from 'react';
import { BaseProps, HoverProps } from '@bytedance/mona';
import cs from 'classnames';

const LONG_DURATION = 350;
const HOVER_START_TIME = 20;
const HOVER_STAY_TIME = 70;

function isFunc(val: any): val is Function {
  return typeof val === 'function';
}

export function useHandlers(props: BaseProps & HoverProps) {
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
  const shouldEmitLongPressRef = useRef(false);

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

  const handleTouchStart = (e: any) => {
    hoverRef.current = true;
    shouldEmitLongPressRef.current = false;

    delay(() => {
      hoverClassName && hoverRef.current && setIsHover(true);
    }, HOVER_START_TIME)

    delay(() => {
      // simulate long press
      if (hoverRef.current && isFunc(onLongPress)) {
        shouldEmitLongPressRef.current = true;
      }

      hoverRef.current && isFunc(onLongTap) && onLongTap(e);
    }, LONG_DURATION)

    isFunc(onTouchStart) && onTouchStart(e);
  }

  const handleTouchMove = (e: any) => {
    stop();

    isFunc(onTouchMove) && onTouchMove(e);
  }

  const handleTouchEnd = (e: any) => {
    stop();

    isFunc(onTouchEnd) && onTouchEnd(e);
    isFunc(onLongPress) && shouldEmitLongPressRef.current && onLongPress(e);
  }

  const handleTouchCancel = (e: any) => {
    stop();
    
    isFunc(onTouchCancel) && onTouchCancel(e);
  }

  const handleTap = (e: any) => {
    // if longPressEvent already emited, this event will not emit
    !shouldEmitLongPressRef.current && isFunc(onTap) && onTap(e);
  }

  const handleClassName = (name: string | string[]) => cs(name, className, { [hoverClassName]: hoverClassName && isHover })

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