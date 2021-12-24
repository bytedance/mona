import React, { useRef, useState, useEffect, forwardRef, Ref, useImperativeHandle } from 'react';
import Cascader from './components/cascader';
import { PickerViewProps, ValueType, PickerData } from './type';
import styles from './index.module.less';
// 引入less失败
console.log('style', styles);

// disabled value
const prefixCls = 'mona';
const hideEmptyCols = false;

const PickerView = forwardRef((props: PickerViewProps, ref: Ref<{ getData: () => ValueType[] }>) => {
  const { cols = 5, rows = 5, data, disabled = false, value, onColumnChange } = props;
  const [scrollValue, setScrollValue] = useState(value);

  const [itemHeight, setItemHeight] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const scrollValueRef = useRef(value);

  scrollValueRef.current = scrollValue;
  useImperativeHandle(ref, () => ({
    getData() {
      return scrollValueRef.current;
    },
  }));
  function _onColumnChange(value: ValueType[], index: number) {
    setScrollValue(value);
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

  const newItemStyle = {
    height: `${itemHeight}px`,
  };

  return (
    <>
      <div
        className={`${styles.pickerView} all-border-box `}
        style={{ height: `${itemHeight * rows}px` }}
        ref={wrapperRef}
      >
        <Cascader
          prefixCls={prefixCls || ''}
          cols={cols}
          itemStyle={newItemStyle}
          data={data as PickerData[]}
          selectedValue={scrollValue}
          onColumnChange={_onColumnChange}
          itemHeight={itemHeight}
          wrapperHeight={wrapperHeight}
          disabled={disabled}
          rows={rows}
          hideEmptyCols={hideEmptyCols}
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
