import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, HoverProps } from '../base';

export interface NavigatorProps extends BaseProps, HoverProps {
  url: string;
  delta?: number;
  openType?: 'navigate' | 'redirect' | 'switchTab' | 'navigateBack' | 'reLaunch';
}

export const Navigator: React.ComponentType<NavigatorProps> = createComponent<NavigatorProps>('navigator')

