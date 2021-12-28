// 参考arco Mobile
import React from 'react';
import { PickerData, ValueType } from '../type';
import styles from '../index.module.less';

interface MultiPickerProps {
  data: PickerData[][];
  selectedValue: ValueType[];
  children: any;
  itemHeight: number;
  onValueChange: (value: ValueType[], index: number) => void;
}

export default function MultiPicker(props: MultiPickerProps) {
  const { onValueChange, children, itemHeight } = props;

  function getValue() {
    const { children, selectedValue, data } = props;

    if (selectedValue?.length) {
      return selectedValue;
    }
    if (data) {
      return data.map((item: PickerData[]) => item[0]?.value);
    }
    if (!children) {
      return [];
    }
    return React.Children.map(children, (child: any) => {
      const childrenArray: any = React.Children.toArray(child.children || child.props.children);
      return childrenArray?.[0]?.props.value;
    });
  }

  function _onValueChange(value: ValueType, index: number) {
    const newValue = getValue().concat() as ValueType[];
    newValue[index] = value;

    onValueChange?.(newValue, index);
  }

  function renderChild() {
    return React.Children.map(children, (col: any, index) =>
      React.cloneElement(col, {
        onValueChange: (value: ValueType) => _onValueChange(value, index),
        selectedValue: getValue()[index],
      }),
    );
  }

  return (
    <div className={styles.pickerViewMulti} style={{ lineHeight: `${itemHeight}px` }}>
      {renderChild()}
    </div>
  );
}
