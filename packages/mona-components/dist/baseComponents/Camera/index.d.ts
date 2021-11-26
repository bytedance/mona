import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface CameraProps extends BaseProps {
    resolution?: 'low' | 'medium' | 'high';
    devicePosition?: 'front' | 'back';
    flash?: 'off' | 'torch';
    frameSize?: 'small' | 'medium' | 'large';
    onInitDone?: EventHandler;
    onError?: EventHandler;
    onStop?: EventHandler;
}
export declare const Camera: React.ComponentType<CameraProps>;
