import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface OpenDataProps extends BaseProps {
    type: 'userNickName' | 'userAvatarUrl' | 'userGender' | 'userCity' | 'userProvince' | 'userCountry';
    defaultText?: string;
    defaultAvatar?: string;
    useEmptyValue?: boolean;
    onError?: EventHandler;
}
export declare const OpenData: React.ComponentType<OpenDataProps>;
