// 参考arco Mobile
import React, { useCallback, useEffect, useMemo, useRef, CSSProperties, useState, useLayoutEffect } from 'react';
import { PickerData, ValueType, PickerCellMovingStatus } from '../Picker/type';
import styles from '../PickerView/index.module.less';
import { useRefState } from '../Picker/hooks';

export function getStyleWithVendor(style: any): CSSProperties {
  const allowReg = /(transform|transition|animation)/i;
  const newStyle = Object.keys(style).reduce<any>((acc, key) => {
    const webkitStyle = allowReg.test(key)
      ? {
          [`Webkit${key.replace(/^(.)/, (_, p1) => p1.toUpperCase())}`]: style[key],
        }
      : {};
    return {
      ...acc,
      [key]: style[key],
      ...webkitStyle,
    };
  }, {});
  return newStyle;
}

interface PickerCellProps {
  data: PickerData[];
  itemHeight: number;
  wrapperHeight: number;
  selectedValue?: ValueType;
  onValueChange?: (value: ValueType) => any;
  onScrollChange?: (value: ValueType) => any;
  rows?: number;
}

const PickerCell: React.FC<PickerCellProps> = props => {
  const { data, itemHeight, wrapperHeight, selectedValue, onValueChange, rows = 5, ...restProps } = props;

  const [transitionDuration, setTransitionDuration] = useState('');
  const [bezier, setBezier] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentValue, setCurrentValue] = useState(selectedValue);
  const [transformY, transformYRef, setTransformY] = useRefState(0);

  const lastTransformYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const latestCallbackTimer = useRef(0);
  const touchStartYRef = useRef(0);
  const touchingRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const movingStatusRef = useRef<PickerCellMovingStatus>(PickerCellMovingStatus.normal);

  const rowCount = Math.max(rows % 2 === 0 ? rows + 1 : rows, 3);

  const colStyle = useMemo(
    () =>
      getStyleWithVendor({
        transform: `translate3d(0px, ${transformY || 0}px, 0px)`,
        ...(transitionDuration ? { transitionDuration } : {}),
        transitionTimingFunction: bezier,
        paddingBottom: `${((rowCount - 1) / 2) * itemHeight}px`,
        paddingTop: `${((rowCount - 1) / 2) * itemHeight}px`,
      }),
    [transitionDuration, transformY, bezier, itemHeight, rowCount],
  );

  function scrollingComplete(nowItemIndex: number) {
    if (currentIndex !== nowItemIndex) {
      setCurrentIndex(nowItemIndex);
      const newValue = data[nowItemIndex]?.value;

      if (newValue !== currentValue) {
        setCurrentValue(newValue);
        onValueChange?.(newValue);
      }
    }
  }

  const scrollTo = useCallback((transY: number, transDuration = 0, cb = () => {}) => {
    setTransitionDuration(transDuration ? `${transDuration}ms` : '');
    setTransformY(transY);

    if (latestCallbackTimer.current) {
      clearTimeout(latestCallbackTimer.current);
    }

    latestCallbackTimer.current = window.setTimeout(() => {
      movingStatusRef.current = PickerCellMovingStatus.normal;
      setTransitionDuration('');
      cb();
    }, transDuration);
  }, []);

  function scrollToIndex(itemIndex: number, transDuration = 0) {
    scrollTo(-1 * itemIndex * itemHeight, transDuration, () => {
      scrollingComplete(itemIndex);
    });
  }

  const handleColumnTouchStart = useCallback((e: TouchEvent) => {
    movingStatusRef.current = PickerCellMovingStatus.moving;
    const y = e.touches[0].screenY;
    touchStartTimeRef.current = Number(new Date());
    touchingRef.current = true;
    touchStartYRef.current = y;
    lastTransformYRef.current = transformYRef.current;
  }, []);

  const handleColumnTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!touchingRef.current) {
        return;
      }
      e.cancelable && e.preventDefault();
      const lastTransformY = lastTransformYRef.current;
      const touchMoveY = e.touches[0].screenY;
      const distance = touchMoveY - touchStartYRef.current;
      const newPos = lastTransformY + distance;
      const maxPos = -1 * (data.length - 1) * itemHeight;
      setTransformY(
        (lastTransformY >= 0 && distance > 0) || (lastTransformY <= maxPos && distance < 0)
          ? lastTransformY + distance / 4
          : newPos,
      );
    },
    [data.length, itemHeight],
  );

  useEffect(() => {
    wrapRef.current?.addEventListener('touchstart', handleColumnTouchStart);
    wrapRef.current?.addEventListener('touchmove', handleColumnTouchMove);
    return () => {
      wrapRef.current?.removeEventListener('touchstart', handleColumnTouchStart);
      wrapRef.current?.removeEventListener('touchmove', handleColumnTouchMove);
    };
  }, [handleColumnTouchStart, handleColumnTouchMove]);

  function handleScrollEnd() {
    const maxIndex = data.length - 1;
    const nowIndex = Math.max(0, Math.min(maxIndex, Math.round((-1 * transformY) / itemHeight)));
    scrollToIndex(nowIndex, 100);
  }

  // 参考：https://juejin.im/post/6844904185121488910
  //@ts-ignore
  function momentum(current, start, duration, minY, maxY) {
    const durationMap: Record<string, number> = {
      noBounce: 800,
      weekBounce: 800,
      strongBounce: 400,
    };
    const bezierMap: Record<string, string> = {
      noBounce: 'cubic-bezier(.17, .89, .45, 1)',
      weekBounce: 'cubic-bezier(.25, .46, .45, .94)',
      strongBounce: 'cubic-bezier(.25, .46, .45, .94)',
    };
    let type = 'noBounce';
    const deceleration = 0.003;
    const bounceRate = 5;
    const bounceThreshold = 300;
    const maxOverflowY = wrapperHeight / 6;
    let overflowY;

    const distance = current - start;
    const speed = (2 * Math.abs(distance)) / duration;
    let destination = current + (speed / deceleration) * (distance < 0 ? -1 : 1);
    if (destination < minY) {
      overflowY = minY - destination;
      type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
      destination = Math.max(minY - maxOverflowY, minY - overflowY / bounceRate);
    } else if (destination > maxY) {
      overflowY = destination - maxY;
      type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
      destination = Math.min(maxY + maxOverflowY, maxY + overflowY / bounceRate);
    }

    return {
      destination,
      duration: durationMap[type],
      bezier: bezierMap[type],
    };
  }

  function handleColumnTouchEnd() {
    movingStatusRef.current = PickerCellMovingStatus.normal;
    const lastTransformY = lastTransformYRef.current;
    if (transformY === lastTransformY) {
      return;
    }
    touchingRef.current = false;
    const endTime = Number(new Date());
    const scrollerHeight = (data.length + rowCount - 1) * itemHeight;
    const duration = endTime - touchStartTimeRef.current;
    const absDistY = Math.abs(transformY - lastTransformY);
    if (duration < 300 && absDistY > 30) {
      const momentumY = momentum(transformY, lastTransformY, duration, wrapperHeight - scrollerHeight, 0);

      const newItemIndex = Math.max(
        0,
        Math.min(data.length - 1, Math.round((-1 * momentumY.destination) / itemHeight)),
      );

      setBezier(momentumY.bezier);

      movingStatusRef.current = PickerCellMovingStatus.scrolling;
      scrollToIndex(newItemIndex, momentumY.duration);
    } else {
      handleScrollEnd();
    }
  }

  function handleItemClick(itemIndex: number) {
    scrollToIndex(itemIndex, 100);
  }

  useLayoutEffect(() => {
    if ('selectedValue' in props) {
      const curIndex = data.findIndex((item: PickerData) => item.value === selectedValue);
      setCurrentIndex(curIndex);

      if (curIndex >= 0) {
        scrollToIndex(curIndex, 0);
      }
    }
    //@ts-ignore
  }, [selectedValue, itemHeight]);

  return data?.length ? (
    <div className={styles.pickerViewColumn} {...restProps}>
      <div
        className={styles.pickerViewColumnItemWrap}
        style={colStyle}
        ref={wrapRef}
        onTouchEnd={handleColumnTouchEnd}
        onTouchCancel={handleColumnTouchEnd}
      >
        {data.map((item, index) => {
          return (
            <div key={`${item.value}${index}`} style={{ height: itemHeight }} onClick={() => handleItemClick(index)}>
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default PickerCell;
