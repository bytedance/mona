import React, { useRef, useEffect, useState, useCallback, TouchEventHandler } from 'react';
import { MovableViewProps } from '@bytedance/mona';
import { formatTouchEvent, genEvent } from '../utils';
import cs from 'classnames';
import styles from './index.module.less';

type Position = { x: number; y: number };
const getDistance = (start: Position, stop: Position) => {
  return Math.hypot(stop.x - start.x, stop.y - start.y);
};

const checkPosi = (
  value: Position,
  wrapperInfo: { wrapperWidth: number; wrapperHeight: number },
  itemInfo: { itemWidth: number; itemHeight: number },
  outOfBounds: boolean,
) => {
  let { x, y } = value;
  const { wrapperWidth, wrapperHeight } = wrapperInfo;
  const { itemWidth, itemHeight } = itemInfo;
  let [overflowX, overflowY] = [true, true];
  const xLimit = wrapperWidth - itemWidth;
  const yLimit = wrapperHeight - itemHeight;

  let [xMin, xMax] = [0, xLimit];
  let [yMin, yMax] = [0, yLimit];

  if (outOfBounds) {
    const xOverflowLimit = (itemWidth / 2) * 0.8;
    const yOverflowLimit = (itemHeight / 2) * 0.8;

    xMin -= xOverflowLimit;
    xMax += xOverflowLimit;

    yMin -= yOverflowLimit;
    yMax += yOverflowLimit;
  }

  if (x < xMin) {
    x = xMin;
  } else if (x > xMax) {
    x = xMax;
  }
  if (x >= 0 && x <= xLimit) {
    overflowX = false;
  }
  if (y < yMin) {
    y = yMin;
  } else if (y > yMax) {
    y = yMax;
  }
  if (y >= 0 && y <= yLimit) {
    overflowY = false;
  }
  return {
    data: { x, y },
    overflow: overflowY || overflowX,
  };
};
const MovableView: React.FC<MovableViewProps> = props => {
  let {
    // scale,
    scaleValue = 1,
    scaleMax = 10,
    scaleMin = 0.5,
    children,
    disabled,
    x = 0,
    y = 0,
    // onScale,
    damping = 20,
    friction = 2,
    //@ts-ignore
    wrapperWidth,
    //@ts-ignore
    wrapperHeight,
    //@ts-ignore
    wrapperRef,
    //@ts-ignore

    scaleArea,
    className,
  } = props;
  // const ref = useRef<HTMLDivElement>(null);
  const domRef = useRef<HTMLSpanElement>(null);

  const disRef = useRef({ distX: 0, distY: 0 });
  const propsRef = useRef<Required<MovableViewProps> & Record<string, any>>(props as Required<MovableViewProps>);
  const stateRef = useRef<Record<string, any>>({});

  const [{ x: innerX, y: innerY }, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [executing, setExecuting] = useState(false);

  const [innerScale, setScale] = useState(scaleValue);

  useEffect(() => {
    const sValue = scaleValue < scaleMax ? (scaleValue > scaleMin ? scaleValue : scaleMin) : scaleMax;
    setScale(sValue);
  }, [scaleValue, scaleMax, scaleMin]);

  propsRef.current = props as Required<MovableViewProps>;
  stateRef.current = {
    executing,
  };

  const setPositionWithCheck = useCallback(
    (posi: Position | ((value: Position) => Position), outOfBounds?: boolean, e?: React.TouchEvent) => {
      outOfBounds = outOfBounds === undefined ? propsRef.current.outOfBounds : outOfBounds;
      const check = (posi: Position) => {
        const { width: realWidth, height: realHeight } = domRef.current!.getBoundingClientRect() ?? {};
        const { data, overflow } = checkPosi(
          posi,
          { wrapperWidth, wrapperHeight },
          {
            // 获取scale之后的宽高
            itemHeight: realHeight,
            itemWidth: realWidth,
          },
          !!outOfBounds,
        );
        let formatEvent;
        if (e) {
          formatEvent = formatTouchEvent({ event: e, type: 'change' });
          formatEvent.detail = { ...data };
          if (overflow) {
            formatEvent.detail.source = 'touch-out-of-bounds';
          } else {
            formatEvent.detail.source = 'touch';
          }
        } else {
          formatEvent = genEvent({ detail: {}, type: 'change' });
          formatEvent.detail = { ...data };
          formatEvent.detail.source = '';
        }

        propsRef.current.onChange?.(formatEvent);

        return { data, overflow };
      };
      if (typeof posi === 'function') {
        setPosition(pre => check(posi(pre)).data);
      } else {
        setPosition(check(posi).data);
      }
    },
    [wrapperWidth, wrapperHeight],
  );

  useEffect(() => {
    setExecuting(true);
    setPositionWithCheck({ x: +x, y: +y }, false);
  }, [x, y, setPositionWithCheck]);

  const handleTouchStart = useCallback<TouchEventHandler<HTMLSpanElement>>(e => {
    setExecuting(false);
    const { clientX, clientY } = e.targetTouches[0];
    const posInfo = domRef.current!.getBoundingClientRect();
    disRef.current.distX = clientX - posInfo.left;
    disRef.current.distY = clientY - posInfo.top;
  }, []);
  const handleScale = useCallback<TouchEventHandler<HTMLSpanElement>>(e => {
    const { clientX, clientY } = e.targetTouches[0];
    const { distX, distY } = disRef.current;
    const L = clientX - distX,
      T = clientY - distY;
    if (!propsRef.current.scale) {
      return;
    }
    const touches = e.targetTouches;
    const events = touches[0];
    const events2 = touches[1];
    const zoom = getDistance(
      {
        x: events.pageX,
        y: events.pageY,
      },
      {
        x: events2.pageX,
        y: events2.pageY,
      },
    );

    setScale(preScale => {
      const { scaleMin, scaleMax } = propsRef.current;
      const newScaleValue = preScale * zoom;
      const res = newScaleValue < scaleMax ? (newScaleValue > scaleMin ? newScaleValue : scaleMin) : scaleMax;
      const formatEvent = formatTouchEvent({ event: e, type: 'change' });
      formatEvent.detail = {
        x: L,
        y: T,
        scale: res,
      };
      propsRef.current.onScale?.(formatEvent);

      return res;
    });
  }, []);
  const handleTouchMove = useCallback<TouchEventHandler<HTMLSpanElement>>(
    e => {
      const tLength = e.targetTouches.length;
      const { clientX, clientY } = e.targetTouches[0];
      const { distX, distY } = disRef.current;
      const L = clientX - distX,
        T = clientY - distY;
      if (tLength === 1) {
        const { direction } = propsRef.current;
        if (direction === 'horizontal') {
          setPositionWithCheck(pre => ({ x: L, y: pre.y }), undefined, e);
        } else if (direction === 'vertical') {
          setPositionWithCheck(pre => ({ x: pre.x, y: T }), undefined, e);
        } else if (direction === 'all') {
          setPositionWithCheck({ x: L, y: T }, undefined, e);
        } else {
          return;
        }
      } else if (tLength === 2) {
        !scaleArea && handleScale(e);
      }
    },
    [setPositionWithCheck, handleScale, scaleArea],
  );
  const handleTouchEnd = useCallback<TouchEventHandler<HTMLSpanElement>>(
    e => {
      setPosition(({ x, y }) => {
        const { wrapperWidth, wrapperHeight } = propsRef.current;
        const { width: realWidth, height: realHeight } = domRef.current!.getBoundingClientRect() ?? {};

        const { data } = checkPosi(
          { x, y },
          { wrapperWidth, wrapperHeight },
          {
            itemHeight: realHeight,
            itemWidth: realWidth,
          },
          false,
        );
        let formatEvent;
        formatEvent = formatTouchEvent({ event: e, type: 'change' });
        formatEvent.detail = { ...data };
        formatEvent.detail.source = 'out-of-bounds';
        if (data.x !== x || data.y !== y) {
          propsRef.current.onChange?.(formatEvent);
          setExecuting(true);
        }

        return data;
      });
    },
    [setPositionWithCheck],
  );
  const animationTime = `${4 / friction / damping}s`;

  const transitionStyle = executing
    ? {
        transition: `scale ${animationTime}, transform ${animationTime}`,
      }
    : { transition: `scale ${animationTime}` };

  useEffect(() => {
    const wrapperDom = wrapperRef.current as HTMLDivElement;
    if (wrapperDom && scaleArea) {
      wrapperDom.addEventListener('touchmove', handleScale as any);
    }
    return () => {
      scaleArea && wrapperDom.removeEventListener('touchmove', handleScale as any);
    };
  }, [handleScale, scaleArea]);

  return (
    //@ts-ignore
    <span
      ref={domRef}
      //@ts-ignore
      onTransitionEnd={() => setExecuting(false)}
      //@ts-ignore
      onTouchStart={disabled ? undefined : handleTouchStart}
      //@ts-ignore
      onTouchMove={disabled ? undefined : handleTouchMove}
      //@ts-ignore
      onTouchEnd={disabled ? undefined : handleTouchEnd}
      style={{
        transform: `translate(${innerX}px, ${innerY}px) scale(${innerScale})`,
        ...transitionStyle,
      }}
      className={cs(className, styles.touch)}
    >
      {children}
    </span>
  );
};

export default MovableView;

MovableView.defaultProps = {
  direction: 'none',
  inertia: false,
  outOfBounds: false,
  damping: 20,
  friction: 2,
  disabled: false,
  scale: false,
  scaleMin: 0.5,
  scaleMax: 10,
  animation: true,
};
