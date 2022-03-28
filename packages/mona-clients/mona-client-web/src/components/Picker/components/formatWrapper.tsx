// 参考arco Mobile
import React, { useMemo } from 'react';
import { PickerData, ValueType } from '../type';
import MultiPicker from './multiPicker';
import PickerCell from '../../PickerViewColumn/pickerCell';

export function arrayTreeFilter<T>(data: T[], filterFn: (item: T, level: number) => boolean) {
  const childrenKeyName = 'children';
  let children = data || [];
  const result: T[] = [];
  let level = 0;

  do {
    const foundItem: T = children.find(item => filterFn(item, level))!;
    if (!foundItem) {
      break;
    }
    result.push(foundItem);
    children = (foundItem as any)[childrenKeyName] || [];
    level += 1;
  } while (children.length > 0);
  return result;
}
export interface IPickerFormatProps {
  cols: number;
  data: PickerData[];
  itemHeight: number;
  wrapperHeight: number;
  selectedValue: ValueType[];
  rows?: number;
  onColumnChange?: (value: ValueType[], index: number) => void;
}

const FormatWrapper: React.FC<IPickerFormatProps> = props => {
  const { cols, data, itemHeight, wrapperHeight, rows, onColumnChange, selectedValue = [] } = props;

  function _onValueChange(value: ValueType[], index: number) {
    const children: PickerData[] = arrayTreeFilter(
      data,
      (item: PickerData, level: number) => level <= index && item.value === value[level],
    );

    let child = children[index];
    let i: number;

    for (i = index + 1; i < cols && child && child.children; i++) {
      const idx = child.children?.findIndex(item => item.value === value[i]);
      if (idx !== -1) {
        value[i] = idx;
        child = child.children[idx];
      } else {
        child = child.children[0];
        value[i] = child.value;
      }
    }
    value.length = i;
    onColumnChange?.(value, index);
  }

  function _formatData() {
    const childrenTree = arrayTreeFilter(
      data,
      (item: PickerData, level: number) => item.value === selectedValue[level],
    ).map(item => item.children);
    const needPad = cols - childrenTree.length;
    if (needPad > 0) {
      for (let i = 0; i < needPad; i++) {
        childrenTree.push([]);
      }
    }
    childrenTree.length = cols - 1;
    childrenTree.unshift(data);
    return childrenTree as PickerData[][];
  }

  const formatData = useMemo<PickerData[][]>(() => _formatData(), [data, selectedValue]);

  return (
    <MultiPicker data={formatData} selectedValue={selectedValue} itemHeight={itemHeight} onValueChange={_onValueChange}>
      {formatData.map((item, index) => (
        <PickerCell
          key={`${index}_picker_cell_normal`}
          data={item || []}
          itemHeight={itemHeight}
          wrapperHeight={wrapperHeight}
          rows={rows}
        />
      ))}
    </MultiPicker>
  );
};

export default FormatWrapper;
