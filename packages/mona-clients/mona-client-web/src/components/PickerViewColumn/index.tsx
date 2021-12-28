//@ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PickerViewColumnProps } from '@bytedance/mona';

import PickerCell from './pickerCell';
import { useHandlers } from '../hooks';

const PickerViewColumn: React.FC<PickerViewColumnProps> = ({
  children,
  itemHeight,
  wrapperHeight,
  selectedValue,
  onValueChange,
  ...restProps
}) => {
  const { handleClassName, ...handleProps } = useHandlers(restProps);

  return (
    <PickerCell
      data={useMemo(() => {
        const res: any = [];
        React.Children.forEach(children, (item, idx) => {
          res.push({
            value: idx,
            label: item,
          });
        });
        return res;
      }, [])}
      selectedValue={selectedValue}
      itemHeight={itemHeight}
      wrapperHeight={wrapperHeight}
      onValueChange={onValueChange}
      {...handleProps}
    />
  );
};

export default PickerViewColumn;
