import React from 'react';
import { BaseProps, EventHandler } from '../base';
declare type ImageMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
export interface ImageProps extends BaseProps {
    src?: string;
    mode?: ImageMode;
    lazyLoad?: boolean;
    onError?: EventHandler;
    onLoad?: EventHandler;
}
export declare const Image: React.ComponentType<ImageProps>;
export {};
