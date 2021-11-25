import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface SwiperItemProps extends BaseProps {
  itemId?: string
}

export const SwiperItem: React.ComponentType<SwiperItemProps> = createComponent<SwiperItemProps>('swiper-item')
