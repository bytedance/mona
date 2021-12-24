import React from 'react';
// import { PickerProps } from '@bytedance/mona';

export enum PickerCellMovingStatus {
  normal = 'normal',
  moving = 'moving',
  scrolling = 'scrolling',
}
export type ValueType = string | number;

export interface PickerData {
  value: ValueType;
  label: React.ReactNode;
  children?: PickerData[];
}

export interface PickerViewProps {
  data: PickerData[];


  cols?: number;
  rows?: number;
  value: ValueType[];
  onColumnChange?: (value: ValueType[], index: number) => void;
}
