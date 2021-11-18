import React from 'react';
import { BaseProps } from '../base';
export interface ButtonProps extends BaseProps {
    size?: 'default' | 'mini';
    type?: 'primary' | 'default';
    disabled?: boolean;
    loading?: boolean;
    hoverClassName?: string;
    hoverStartTime?: number;
    hoverStayTime?: number;
    hoverStopPropagation?: boolean;
    formType?: 'submit' | 'reset';
    openType?: 'share' | 'getPhoneNumber';
    onClick?: (e: any) => void;
    onGetPhoneNumber?: (e: any) => void;
}
export declare const Button: React.ComponentType<ButtonProps>;
