import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface FormProps extends BaseProps {
    onSubmit?: EventHandler;
    onReset?: EventHandler;
}
export declare const Form: React.ComponentType<FormProps>;
