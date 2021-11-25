import React from 'react';
import { BaseProps, HoverProps } from '../base';
export interface ButtonProps extends BaseProps, HoverProps {
    size?: 'default' | 'mini';
    type?: 'primary' | 'default';
    disabled?: boolean;
    loading?: boolean;
    formType?: 'submit' | 'reset';
    openType?: 'share' | 'getPhoneNumber';
    onClick?: (e: any) => void;
    onGetPhoneNumber?: (e: any) => void;
}
export declare const Button: React.ComponentType<ButtonProps>;
