import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface MovableViewProps extends BaseProps {
    direction?: 'all' | 'vertical' | 'horizontal' | 'none';
    inertia?: boolean;
    outOfBounds?: boolean;
    x?: string | number;
    y?: string | number;
    damping?: number;
    friction?: number;
    disabled?: boolean;
    scale?: boolean;
    scaleMin?: number;
    scaleMax?: number;
    scaleValue?: number;
    animation?: boolean;
    onChange?: EventHandler;
    onScale?: EventHandler;
    onHtouchMove?: EventHandler;
    onVtouchMove?: EventHandler;
}
export declare const MovableView: React.ComponentType<MovableViewProps>;
