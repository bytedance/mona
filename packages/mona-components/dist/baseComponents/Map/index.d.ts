import React from 'react';
import { BaseProps, EventHandler } from '../base';
interface Circle {
    latitude: number;
    longtitude: number;
    color?: string;
    fillColor?: string;
    radius?: number;
    strokeWidth?: number;
}
interface Point {
    longtitude: number;
    latitude: number;
}
interface Polyline {
    points: Point[];
    color?: string;
    width?: number;
    dottedLine?: boolean;
}
interface Callout {
    content?: string;
    color?: string;
    fontSize?: number;
    borderRadius?: number;
    padding?: number;
    display?: 'BYCLICK' | 'ALWAYS';
    textAlign?: 'left' | 'center' | 'right';
}
interface Marker {
    id?: number;
    latitude: number;
    longtitude: number;
    title?: string;
    iconPath?: string;
    width?: number;
    height?: number;
    zIndex?: number;
    callout?: Callout;
}
export interface MapProps extends BaseProps {
    longtitude: number;
    latitude: number;
    scale?: number;
    markers?: Marker[];
    circles?: Circle[];
    showLocation?: boolean;
    polyline?: Polyline[];
    includePoints?: Point[];
    onTap?: EventHandler;
    onMarkerTap?: EventHandler;
    onCalloutTap?: EventHandler;
    onRegionChange?: EventHandler;
}
export declare const Map: React.ComponentType<MapProps>;
export {};
