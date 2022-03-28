import { useEffect, useRef, useState } from 'react';
import { SwiperChangeEvent } from '@bytedance/mona';
import { formatTouchEvent } from '../utils';

let ANIMATION_READY = false;

interface SetTransformParams {
  ele: HTMLElement | null;
  current: number;
  vertical: boolean;
  circular: boolean;
  duration: number;
  noAnimation: boolean;
}

function setTransform({ ele, current, vertical, circular, duration, noAnimation }: SetTransformParams) {
  if (ele) {
    const width = vertical ? ele.clientHeight : ele.clientWidth;
    let realCurrent = current;
    if (circular) {
      realCurrent = current + 1;
    }

    const distance = -width * realCurrent;
    const targetTransform = `${vertical ? 0 : distance}px, ${!vertical ? 0 : distance}px, 0px`;

    ele.style.transitionDuration = `${noAnimation ? 0 : ANIMATION_READY ? duration : 0}ms`;
    ele.style.transform = `translate3d(${targetTransform}`;

    ANIMATION_READY = true;

    if (!noAnimation) {
      setTimeout(() => {
        ele.style.transitionDuration = '0ms';
      }, duration);
    }
  }
}

const tick = 100;

interface UseCurrentParams {
  initCurrent: number;
  total: number;
  duration: number;
  circular: boolean;
}

function useCurrent({ initCurrent, total, duration, circular }: UseCurrentParams) {
  const [current, setCurrent] = useState(initCurrent);
  const lockRef = useRef(false);
  const noAnimationRef = useRef(true);
  const min = circular ? -1 : 0;
  const max = total ? (circular ? total : total - 1) : 0;

  const safelySetCurrent = (current: number) => {
    if (lockRef.current) {
      return;
    }
    noAnimationRef.current = false;
    lockRef.current = true;
    const target = current < min ? min : current > max ? max : current;
    setCurrent(target);

    setTimeout(() => {
      if (circular) {
        if (target === min) {
          noAnimationRef.current = true;
          setCurrent(total - 1);
        } else if (target === max) {
          noAnimationRef.current = true;
          setCurrent(0);
        }
      }
      lockRef.current = false;
    }, duration + tick);
  };

  useEffect(() => {
    safelySetCurrent(initCurrent);
  }, [initCurrent]);

  return { current, setCurrent: safelySetCurrent, noAnimation: noAnimationRef.current };
}

// add two fake childEle in the tail and head of the container
function preHandleEle(ele: HTMLDivElement | null, circular: boolean) {
  if (!ele || ele.children.length === 0) {
    return;
  }

  if (circular) {
    const firstChild = ele.children[0];
    const lastChild = ele.children[ele.children.length - 1];
    const copyedFirstChild = firstChild.cloneNode(true);
    const coypedLastChild = lastChild.cloneNode(true);

    ele.appendChild(copyedFirstChild);
    ele.insertBefore(coypedLastChild, firstChild);

    return () => {
      (copyedFirstChild as Element).remove();
      (coypedLastChild as Element).remove();
    };
  }
  return () => {};
}

interface UseSlideParams {
  current: number;
  total: number;
  vertical: boolean;
  duration: number;
  circular: boolean;
  onChange?: (event: SwiperChangeEvent) => void;
}

export function useSlide({
  current: initCurrent,
  total,
  vertical = false,
  duration,
  circular,
  onChange,
}: UseSlideParams) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { current, setCurrent, noAnimation } = useCurrent({ initCurrent, total, duration, circular });

  useEffect(() => preHandleEle(ref.current, circular), [ref.current, circular]);

  useEffect(() => {
    setTransform({ ele: ref.current, current, vertical, circular, duration, noAnimation });
  }, [ref.current, current, vertical, circular, duration, noAnimation]);

  const activeIndex = current < 0 ? total - 1 : current >= total ? 0 : current;

  const setActiveIndex = (index: number, byAuto?: boolean, e?: React.TouchEvent) => {
    if (typeof onChange === 'function') {
      const event: SwiperChangeEvent = e ?
        {
          ...formatTouchEvent({ event: e, type: 'change' }),
          detail: {
            current: activeIndex,
            source: byAuto ? 'autoplay' : 'touch',
          },
        } :
        {
          touches: [],
          changedTouches: [],
          type: 'change',
          target: { id: '', tagName: '', dataset: {} },
          currentTarget: { id: '', tagName: '', dataset: {} },
          timeStamp: 0,
          detail: {
            current: activeIndex,
            source: byAuto ? 'autoplay' : 'touch',
          },
        };
      onChange(event);
    }
    setCurrent(index >= total ? 0 : index < 0 ? total - 1 : index);
  };

  const next = (byAuto?: boolean, e?: React.TouchEvent) => {
    setActiveIndex(current + 1, byAuto, e);
  };

  const prev = (byAuto?: boolean, e?: React.TouchEvent) => {
    setActiveIndex(current - 1, byAuto, e);
  };

  return {
    next,
    prev,
    wrapperRef: ref,
    activeIndex,
  };
}

type HandleFunc = ((e: React.TouchEvent) => void) | null;
interface UseTouchParams {
  left: HandleFunc;
  right: HandleFunc;
  top: HandleFunc;
  bottom: HandleFunc;
  duration: number;
}

const validTouchDistance = 20;
export function useTouch({ left, right, top, bottom, duration }: UseTouchParams) {
  const startRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lockRef = useRef(false);
  const handleTouchStart = (e: React.TouchEvent) => {
    const { changedTouches } = e;
    startRef.current = {
      x: changedTouches[0].pageX,
      y: changedTouches[0].pageY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (lockRef.current) {
      return;
    }
    const { changedTouches } = e;
    const moveX = changedTouches[0].pageX;
    const moveY = changedTouches[0].pageY;
    const { x, y } = startRef.current;

    const dx = moveX - x;
    const dy = moveY - y;

    if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) > validTouchDistance) {
      lockRef.current = true;

      // horizontal move
      if (dx > 0) {
        // l2r
        right && right(e);
      } else {
        // r2l
        left && left(e);
      }
      setTimeout(() => {
        lockRef.current = false;
      }, duration + tick);
    } else if (Math.abs(dx) < Math.abs(dy) && Math.abs(dy) > validTouchDistance) {
      lockRef.current = true;
      // vertical move
      if (dy > 0) {
        bottom && bottom(e);
      } else {
        top && top(e);
      }
      setTimeout(() => {
        lockRef.current = false;
      }, duration + tick);
    }
  };

  return { handleTouchStart, handleTouchMove };
}
