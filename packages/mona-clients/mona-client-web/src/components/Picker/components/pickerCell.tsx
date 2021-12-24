import React, { CSSProperties, useState, useLayoutEffect, useMemo, useRef, useCallback, useEffect } from 'react';
import cls from 'classnames';
import { ValueType, PickerData, PickerCellMovingStatus } from '../type';
import styles from '../index.module.less';
export function useRefState<T>(
  initialValue: T | (() => T),
): [T, React.MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef<T>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  return [state, stateRef, setState];
}
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

export interface PickerCellProps {
  prefixCls: string;
  style?: React.CSSProperties;
  data: PickerData[];
  itemHeight: number;
  wrapperHeight: number;
  selectedValue?: ValueType;
  onValueChange?: (value: ValueType) => void;
  onScrollChange?: (value: ValueType) => void;
  disabled: boolean;
  hideEmptyCols?: boolean;
  rows?: number;
}
export interface PickerCellRef {
  movingStatus: PickerCellMovingStatus;
}

const PickerCell = (props: PickerCellProps) => {
  const { prefixCls, style, data, itemHeight, wrapperHeight, selectedValue, onValueChange, disabled, rows = 5 } = props;
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
  const movingStatusRef = useRef<PickerCellMovingStatus>('normal');
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

  function _scrollingComplete(nowItemIndex: number) {
    // index有改变时再抛出
    if (currentIndex !== nowItemIndex) {
      setCurrentIndex(nowItemIndex);
      const newValue = data[nowItemIndex] && data[nowItemIndex].value;

      if (newValue !== currentValue) {
        setCurrentValue(newValue);
        if (onValueChange) {
          onValueChange(newValue);
        }
      }
    }
  }

  function _scrollTo(transY: number, transDuration = 0, callback = () => {}) {
    setTransitionDuration(transDuration ? `${transDuration}ms` : '');
    setTransformY(transY);
    // 处理连续滑动的情况：
    // 如果上一次callback还未执行，先cancel掉上一次回调，只执行最近的一次回调
    if (latestCallbackTimer.current) {
      clearTimeout(latestCallbackTimer.current);
    }

    latestCallbackTimer.current = window.setTimeout(() => {
      movingStatusRef.current = 'normal';
      setTransitionDuration('');
      callback();
    }, transDuration);
  }

  function _scrollToIndex(itemIndex: number, transDuration = 0, callback = () => {}) {
    _scrollTo(-1 * itemIndex * itemHeight, transDuration, callback);
  }

  function _scrollToIndexWithChange(itemIndex: number, transDuration = 0) {
    _scrollToIndex(itemIndex, transDuration, () => {
      _scrollingComplete(itemIndex);
    });
  }

  const _handleColumnTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled) {
        return;
      }
      movingStatusRef.current = 'moving';
      const y = e.touches[0].screenY;
      touchStartTimeRef.current = Number(new Date());
      touchingRef.current = true;
      touchStartYRef.current = y;
      lastTransformYRef.current = transformYRef.current;
    },
    [disabled],
  );

  const _handleColumnTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled || !touchingRef.current) {
        return;
      }
      e.cancelable && e.preventDefault();
      const lastTransformY = lastTransformYRef.current;
      const touchMoveY = e.touches[0].screenY;
      const distance = touchMoveY - touchStartYRef.current;
      const newPos = lastTransformY + distance;
      const maxPos = -1 * (data.length - 1) * itemHeight;
      // 当滚动到上边界或下边界时增加阻尼效果
      setTransformY(
        (lastTransformY >= 0 && distance > 0) || (lastTransformY <= maxPos && distance < 0)
          ? lastTransformY + distance / 4
          : newPos,
      );
    },
    [data.length, disabled, itemHeight],
  );

  useEffect(() => {
    if (wrapRef.current) {
      wrapRef.current.addEventListener('touchstart', _handleColumnTouchStart);
      wrapRef.current.addEventListener('touchmove', _handleColumnTouchMove);
    }
    return () => {
      if (wrapRef.current) {
        wrapRef.current.removeEventListener('touchstart', _handleColumnTouchStart);
        wrapRef.current.removeEventListener('touchmove', _handleColumnTouchMove);
      }
    };
  }, [_handleColumnTouchStart, _handleColumnTouchMove]);

  function _handleScrollEnd() {
    const maxIndex = data.length - 1;
    const nowIndex = Math.max(0, Math.min(maxIndex, Math.round((-1 * transformY) / itemHeight)));
    // 滚动（包括加动量的滚动）完成之后定位到最近的一个index上
    _scrollToIndexWithChange(nowIndex, 100);
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

  function _handleColumnTouchEnd() {
    movingStatusRef.current = 'normal';
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

      movingStatusRef.current = 'scrolling';
      _scrollToIndex(newItemIndex, momentumY.duration, () => {
        _scrollingComplete(newItemIndex);
      });
    } else {
      _handleScrollEnd();
    }
  }

  function _handleItemClick(itemIndex: number) {
    if (disabled) {
      return;
    }
    _scrollToIndexWithChange(itemIndex, 100);
  }
  useLayoutEffect(() => {
    if ('selectedValue' in props) {
      const curIndex = data.findIndex((item: PickerData) => item.value === selectedValue);
      setCurrentIndex(curIndex);

      if (curIndex >= 0) {
        _scrollToIndexWithChange(curIndex);
      }
    }
    //@ts-ignore
  }, [selectedValue, itemHeight]);

  return data && data.length ? (
    <div className={styles.pickerViewColumn}>
      <div
        className={styles.pickerViewColumnItemWrap}
        style={colStyle}
        ref={wrapRef}
        onTouchEnd={_handleColumnTouchEnd}
        onTouchCancel={_handleColumnTouchEnd}
      >
        {data.map((item, index) => {
          const dis = Math.abs(index - currentIndex);
          return (
            <div
              key={`${index}_${item.value}`}
              className={cls(`${prefixCls}-column-item`, {
                selected: index === currentIndex,
                [`selected-neighbor-${dis}`]: dis && dis <= Math.floor(rowCount / 2),
              })}
              style={style}
              onClick={() => _handleItemClick(index)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default PickerCell;
