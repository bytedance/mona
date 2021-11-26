import React from 'react';
import { BaseProps, EventHandler, HoverProps } from '../base';
export interface ButtonProps extends BaseProps, HoverProps {
    size?: 'default' | 'mini';
    type?: 'primary' | 'default';
    disabled?: boolean;
    loading?: boolean;
    formType?: 'submit' | 'reset';
    openType?: 'share' | 'getPhoneNumber' | 'contact';
    onGetPhoneNumber?: EventHandler;
}
export declare const Button: React.ComponentType<ButtonProps>;
