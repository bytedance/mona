import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface WebviewProps extends BaseProps {
    src: string;
    progressBarColor?: string;
    onMessage?: EventHandler;
    onLoad?: EventHandler;
    onError?: EventHandler;
}
export declare const Webview: React.ComponentType<WebviewProps>;
