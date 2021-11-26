import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface LivePlayerProps extends BaseProps {
    src: string;
    autoplay?: boolean;
    muted?: boolean;
    orientation?: 'vertical' | 'horizontal';
    objectFit?: 'contain' | 'fillCrop';
    onStateChange?: EventHandler;
    onFullscreenChange?: EventHandler;
    onError?: EventHandler;
}
export declare const LivePlayer: React.ComponentType<LivePlayerProps>;
