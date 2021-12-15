import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SliderProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { useFormContext } from '../Form/hooks';

function formatValue(value: number, min: number, max: number, step: number) {
  let targetValue = value < min ? min : value > max ? max : value;
  const remainder = (targetValue - min) % step;
  if (remainder >= step / 2) {
    targetValue = targetValue - remainder + step;
  } else {
    targetValue = targetValue - remainder;
  }

  const decimalLength = (String(step).split('.')[1] || '').length;

  return Number(Number(targetValue).toFixed(decimalLength));
}

function formatSize(value: number) {
  return value < 12 ? 12 : value > 28 ? 28 : value;
}

function getPercent(value: number, min: number, max: number) {
  return (value - min) / (max - min) * 100;
}

const Slider: React.FC<SliderProps> = (props) => {
  const {
    children,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    value = 0,
    color = '#e9e9e9',
    selectedColor = '#1aad19',
    activeColor = '#1aad19',
    backgroundColor = '#e9e9e9',
    blockSize = 28,
    name = '',
    blockColor = '#ffffff',
    showValue = false,
    onChange,
    onChanging,
    ...restProps
  } = props;
  const [v, setV] = useState(formatValue(value, min, max, step));
  const thumbRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
    setV(formatValue(value, min, max, step));
  }, [value, min, max, step])

  const reset = useCallback(() => setV(min), []);
  useFormContext(name, value, reset);

  const size = formatSize(blockSize);

  const { handleClassName, ...handlerProps } = useHandlers(restProps);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.currentTarget;
    const { left } = target.getBoundingClientRect();
    const width = target.clientWidth;
    const gapWidth = e.clientX - left;
    const ratio = gapWidth / width;
    const newValue = (max - min) * ratio + min;
    setV(formatValue(newValue, min, max, step));
  }

  const percent = getPercent(v, min, max);

  const validTouchDistanceRef = useRef(30);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (wrapperRef.current) {
      const width = wrapperRef.current.offsetWidth;
      const result = width / (max - min) * step;
      const d = validTouchDistanceRef.current;
      validTouchDistanceRef.current = d < result ? d : result;
    }
  }, [wrapperRef.current, max, min, step])

  const startThumbRef = useRef<{ x: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target === thumbRef.current)  {
      const { changedTouches } = e;
      startThumbRef.current = {
        x: changedTouches[0].clientX,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // console.log('move');
    if (!startThumbRef.current) {
      return;
    }

    const { changedTouches } = e;
    const moveX = changedTouches[0].pageX;
    const { x } = startThumbRef.current;

    const dx = moveX - x;
    const abs = Math.abs(dx);
    const dv = validTouchDistanceRef.current;
    if (abs >= dv) {
      startThumbRef.current = {
        x: moveX
      }
      const pos = dx / abs;
      const newValue = v + pos * step * (abs / dv);
      setV(formatValue(newValue, min, max, step));
    }
  }

  const handleTouchEnd = () => {
    startThumbRef.current = null;
  }
  
  return (
    <div className={handleClassName(styles.slider)} {...handlerProps}>
      <div className={styles.wrapper}>
        <div className={styles.tapArea}>
          <div className={styles.handleWrapper} ref={wrapperRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onClick={handleClick} style={{ backgroundColor: backgroundColor || color }}>
            <div className={styles.sliderHandle} ref={thumbRef} style={{ left: `${percent}%` }}></div>
            <div className={styles.sliderThumb} style={{ width: size, height: size, marginLeft: -size/2, marginTop: -size/2, left: `${percent}%`, backgroundColor: blockColor }}></div>
            <div className={styles.sliderTrack} style={{ width: `${percent}%`, backgroundColor: activeColor || selectedColor }}></div>
            <div className={styles.sliderStep}></div>
          </div>
        </div>
        { showValue ? <span className={styles.sliderValue}>{v}</span> : null }
      </div>
    </div>
  )
}

export default Slider;
