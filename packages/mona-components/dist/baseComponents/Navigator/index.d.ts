import React from 'react';
import { BaseProps, HoverProps } from '../base';
export interface NavigatorProps extends BaseProps, HoverProps {
    url: string;
    delta?: number;
    openType?: 'navigate' | 'redirect' | 'switchTab' | 'navigateBack' | 'reLaunch';
}
export declare const Navigator: React.ComponentType<NavigatorProps>;
