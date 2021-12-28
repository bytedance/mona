import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PickerViewProps } from '@bytedance/mona';
import { isElement } from 'react-is';
import { useHandlers } from '../hooks';

import styles from './index.module.less';
import { genEvent } from '../utils';

const PickerView: React.FC<PickerViewProps> = ({
  children,
  value,
  indicatorStyle,
  maskStyle,
  onChange,
  ...restProps
}) => {
  const [itemHeight, setItemHeight] = useState(0);
  const barRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const { handleClassName, ...handleProps } = useHandlers(restProps);
  const innerValueRef = useRef(value ?? []);
  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperHeight(wrapperRef.current.offsetHeight);
    }
    if (barRef.current) {
      setItemHeight(barRef.current.clientHeight);
    }
  }, []);

  function _onValueChange(index: number, nValue: any) {
    const newValue = innerValueRef.current?.concat() ?? [];
    newValue[index] = nValue;
    innerValueRef.current = newValue;
    onChange?.(genEvent({ type: 'change', detail: { value: newValue } }));
  }

  return (
    <div className={styles.pickerView} style={{ height: `${itemHeight * 5}px` }} ref={wrapperRef} {...handleProps}>
      <div className={styles.pickerViewMulti} style={{ lineHeight: `${itemHeight}px` }}>
        {React.Children.map(children, (item, idx) => {
          //@ts-ignore
          if (isElement(item) && item.type.name === 'PickerViewColumn') {
            return React.cloneElement(item, {
              itemHeight,
              wrapperHeight,
              selectedValue: value[idx],
              onValueChange: _onValueChange.bind(null, idx),
            });
          }
        })?.filter(item => item !== null && item !== undefined)}
      </div>

      <div className={styles.pickerViewSelection} style={maskStyle}>
        <div className={styles.pickerViewSelectionMaskTop} />
        <div ref={barRef} className={styles.pickerViewSelectionBar} style={indicatorStyle} />
        <div className={styles.pickerViewSelectionMaskTop} />
      </div>
    </div>
  );
};

export default PickerView;
