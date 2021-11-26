import React from 'react';
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
export declare const ScrollView: React.ComponentType<ScrollViewProps>;
