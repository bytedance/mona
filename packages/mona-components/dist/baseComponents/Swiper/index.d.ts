import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface SwiperProps extends BaseProps {
    indicatorDots?: boolean;
    indicatorColor?: string;
    indicatorActiveColor?: string;
    autoplay?: boolean;
    current?: number;
    currentItemId?: string;
    interval?: number;
    previousMargin?: string;
    nextMargin?: string;
    displayMultipleItems?: number;
    duration?: number;
    circular?: boolean;
    vertical?: boolean;
    onChange?: EventHandler;
    onAnimationFinish?: EventHandler;
    onTransition?: EventHandler;
}
export declare const Swiper: React.ComponentType<SwiperProps>;
