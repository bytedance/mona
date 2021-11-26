import React from 'react';
export interface BaseProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    hidden?: boolean;
}
export interface HoverProps {
    hoverClassName?: string;
    hoverStartTime?: number;
    hoverStayTime?: number;
    hoverStopPropagation?: boolean;
}
export interface EventHandler {
    (event: any): void;
}
