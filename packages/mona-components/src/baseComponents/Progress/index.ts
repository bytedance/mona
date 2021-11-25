import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface ProgressProps extends BaseProps {
  percent?: number;
  strokeWidth?: number;
  color?: string;
  activeColor?: string;
  backgroundColor?: string;
  active?: boolean;
  activeMode?: string;
}

export const Progress: React.ComponentType<ProgressProps> = createComponent<ProgressProps>('progress')
