import React, { useRef, useState, useEffect, forwardRef, Ref, useImperativeHandle } from 'react';
import FormatWrapper from './components/formatWrapper';
import { PickerViewProps, ValueType, PickerData } from './type';
import styles from '../PickerView/index.module.less';

const PickerView = forwardRef((props: PickerViewProps, ref: Ref<{ getData: () => ValueType[] }>) => {
  const { cols = 5, rows = 5, data, value, onColumnChange } = props;
  const [innerValue, setInnerValue] = useState(value);

  const [itemHeight, setItemHeight] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  const innerValueRef = useRef(value);
  innerValueRef.current = innerValue;

  useImperativeHandle(ref, () => ({
    getData() {
      return innerValueRef.current;
    },
  }));

  function _onColumnChange(value: ValueType[], index: number) {
    setInnerValue(value);
    onColumnChange?.(value, index);
  }

  useEffect(() => {
    if (wrapperRef.current) {
      setWrapperHeight(wrapperRef.current.offsetHeight);
    }
    if (barRef.current) {
      setItemHeight(barRef.current.clientHeight);
    }
  }, []);

  return (
    <>
      <div className={styles.pickerView} style={{ height: `${itemHeight * rows}px` }} ref={wrapperRef}>
        <FormatWrapper
          cols={cols}
          data={data as PickerData[]}
          selectedValue={innerValue}
          onColumnChange={_onColumnChange}
          itemHeight={itemHeight}
          wrapperHeight={wrapperHeight}
          rows={rows}
        />
        <div className={styles.pickerViewSelection}>
          <div className={styles.pickerViewSelectionMaskTop} />
          <div ref={barRef} className={styles.pickerViewSelectionBar} />
          <div className={styles.pickerViewSelectionMaskTop} />
        </div>
      </div>
    </>
  );
});

export default PickerView;
