import React, { useEffect, useState } from 'react';
import { SliderProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

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
    blockColor = '#ffffff',
    showValue = false,
    onChange,
    onChanging,
    ...restProps
  } = props;
  const [v, setV] = useState(formatValue(value, min, max, step));

   useEffect(() => {
    setV(formatValue(value, min, max, step));
  }, [value, min, max, step])


  console.log(v);
  const size = formatSize(blockSize);

  const { handleClassName, ...handlerProps } = useHandlers(restProps);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.currentTarget;
    const { left } = target.getBoundingClientRect();
    const width = target.clientWidth;
    const gapWidth = e.clientX - left;
    const ratio = gapWidth / width;
    const newValue = (max - min) * ratio + min;
    console.log('newValue', newValue);
    setV(formatValue(newValue, min, max, step));
  }

  const percent = getPercent(v, min, max);
  
  return (
    <div className={handleClassName(styles.slider)} {...handlerProps}>
      <div className={styles.wrapper}>
        <div className={styles.tapArea}>
          <div className={styles.handleWrapper} onClick={handleClick} style={{ backgroundColor: backgroundColor || color }}>
            <div className={styles.sliderHandle} style={{ left: `${percent}%` }}></div>
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
