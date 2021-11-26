import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface CanvasProps extends BaseProps {
    canvasId: string;
    type: '2d' | 'webgl';
    onTouchStart?: EventHandler;
    onTouchMove?: EventHandler;
    onTouchEnd?: EventHandler;
    onTouchCancel?: EventHandler;
}
export declare const Canvas: React.ComponentType<CanvasProps>;
