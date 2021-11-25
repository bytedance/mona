import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface ScrollViewProps extends BaseProps {
  scrollX?: boolean;
  scrollY?: boolean;
  scrollWithAnimation?: boolean;
  upperThreshold?: number;
  lowerThreshold?: number;
  scrollTop?: number;
  scrollLeft?: number;
  scrollIntoView?: string;
  onScroll?: EventHandler;
  onScrollToUpper?: EventHandler;
  onScrollToLower?: EventHandler;
}

export const ScrollView: React.ComponentType<ScrollViewProps> = createComponent<ScrollViewProps>('scroll-view')
