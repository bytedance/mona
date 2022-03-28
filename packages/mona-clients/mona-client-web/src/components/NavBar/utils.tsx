import { useEffect, useState } from 'react';
import { BaseApis } from '@bytedance/mona';
import EventEmitter from '../../EventEmitter';
import { NavBarProps } from '.';

const eventEmitter = new EventEmitter();

export const useNavBarTitle = (props: NavBarProps) => {
  const [title, setTitle] = useState(props?.navigationBarTitleText);
  const [frontColor, setFrontColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(props?.navigationBarBackgroundColor);

  useEffect(() => {
    eventEmitter.on('setNavigationBarTitle', (options: Parameters<BaseApis['setNavigationBarTitle']>[0]) => {
      if (options.title) {
        setTitle(options.title);
        options?.success?.({ errMsg: 'setNavigationBarTitle:ok' });
        options?.complete?.({ errMsg: 'setNavigationBarTitle:ok' });
      } else {
        options?.success?.({ errMsg: 'setNavigationBarTitle:fail' });
        options?.complete?.({ errMsg: 'setNavigationBarTitle:fail' });
      }
    });

    eventEmitter.on('setNavigationBarColor', (options: Parameters<BaseApis['setNavigationBarColor']>[0]) => {
      if (options.frontColor || options.backgroundColor) {
        options.frontColor && setFrontColor(options.frontColor);
        options.backgroundColor && setBackgroundColor(options.backgroundColor);
        options?.success?.({ errMsg: 'setNavigationBarTitle:ok' });
        options?.complete?.({ errMsg: 'setNavigationBarTitle:ok' });
      } else {
        options?.success?.({ errMsg: 'setNavigationBarTitle:fail' });
        options?.complete?.({ errMsg: 'setNavigationBarTitle:fail' });
      }
    });
  }, []);

  return { title, frontColor, backgroundColor };
};

export const useNavBarColor = () => {};
