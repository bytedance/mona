import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface AdProps extends BaseProps {
    unitId: string;
    onLoad?: EventHandler;
    onError?: EventHandler;
    onClose?: EventHandler;
    adIntervals?: number;
    fixed?: boolean;
    type?: 'banner' | 'video' | 'large' | 'llmg' | 'rlmg';
    scale?: number;
}
export declare const Ad: React.ComponentType<AdProps>;
