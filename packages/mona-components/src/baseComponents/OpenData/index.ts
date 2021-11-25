import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface OpenDataProps extends BaseProps {
  type: 'userNickName' | 'userAvatarUrl' | 'userGender' | 'userCity' | 'userProvince' | 'userCountry';
  defaultText?: string;
  defaultAvatar?: string;
  useEmptyValue?: boolean;
  onError?: EventHandler;
}

export const OpenData: React.ComponentType<OpenDataProps> = createComponent<OpenDataProps>('open-data')

