import React from 'react';
// import { PickerProps } from '@bytedance/mona';

export type PickerCellMovingStatus = 'normal' | 'moving' | 'scrolling';
export type ValueType = string | number;
export interface PickerData {
  value: ValueType;
  label: React.ReactNode;
  children?: PickerData[];
}

export interface PickerViewProps {
  data: PickerData[];

  cascade?: boolean;

  cols?: number;

  rows?: number;

  disabled?: boolean;

  value: ValueType[];

  onColumnChange?: (value: ValueType[], index: number) => void;
}
