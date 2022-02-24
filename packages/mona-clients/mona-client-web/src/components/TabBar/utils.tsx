import { redirectTo } from '../../apis/api';
import { formatPath } from '@bytedance/mona-shared';
import { BaseApis } from '@bytedance/mona';
import EventEmitter from '../../EventEmitter';
import { useHistory } from 'react-router';
import { TabBarProps } from '.';
import { useEffect, useState } from 'react';

const eventEmitter = new EventEmitter();

const defaultTabProps: TabBarProps = {
  color: 'inherit',
  selectedColor: 'inherit',
  backgroundColor: '#fff',
  list: []
}

function safeSet(value: any, oldValue: any) {
  return typeof value === 'undefined' ? oldValue : value;
}

export const useTabProps = (rawTab?: TabBarProps) => {
  const [tab, setTab] = useState(rawTab ?? defaultTabProps);

  useEffect(() => {
    eventEmitter.on('setTabBarStyle', (options: Parameters<BaseApis['setTabBarStyle']>[0]) => {
      if (options) {
        const { success, complete, color, selectedColor, backgroundColor, borderStyle } = options;
        setTab(prev => ({
          ...prev,
          color: safeSet(color, prev.color),
          selectedColor: safeSet(selectedColor, prev.selectedColor),
          backgroundColor: safeSet(backgroundColor, prev.backgroundColor),
          borderStyle: safeSet(borderStyle, prev.borderStyle),
        }))

        if (typeof success === 'function') {
          success({ errMsg: '' })
        }
        if (typeof complete === 'function') {
          complete({ errMsg: '' })
        }
      }
    })

    eventEmitter.on('setTabBarItem', (options: Parameters<BaseApis['setTabBarItem']>[0]) => {
      if (options) {
        const { success, fail, complete, index, text = '', iconPath, selectedIconPath } = options;
        setTab(prev => {
          const old = prev.list;
          if (!old[index]) {
            if (typeof fail === 'function') {
              fail({ errMsg: 'invalid index when setTabBarItem' })
            }
            return prev;
          }
          
          const target = old[index];

          old[index] = {
            ...target,
            text: safeSet(text, target.text),
            // TODO 处理iconPath变化
            iconPath: safeSet(iconPath, target.iconPath),
            selectedIconPath: safeSet(selectedIconPath, target.selectedIconPath)
          }
          return {
            ...prev,
            list: old
          } 
        })

        if (typeof success === 'function') {
          success({ errMsg: '' })
        }
        if (typeof complete === 'function') {
          complete({ errMsg: '' })
        }
      }
    })
  }, [])

  return { tab };
}

export const useBadge = () => {
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    eventEmitter.on('setTabBarBadge', (options: Parameters<BaseApis['setTabBarBadge']>[0]) => {
      setBadges(prev => {
        prev[options.index] === options.text;
        return prev;
      })
    })

    eventEmitter.on('removeTabBarBadge', (options: Parameters<BaseApis['removeTabBarBadge']>[0]) => {
      setBadges(prev => {
        prev.splice(options.index, 1)
        return prev;
      })
    })
  }, [])

  return { badges }
}

export const useToggleDotShow = () => {
  const [dotIndexs, setDotIndexs] = useState<number[]>([]);

  useEffect(() => {
    eventEmitter.on('setTabBarDotToggle', (show: boolean, options?: Parameters<BaseApis['showTabBarRedDot']>[0]): void => {
      if (show && options?.index) {
        setDotIndexs((prev) => Array.from(new Set([...prev, options?.index])))
      } else if(!show && options?.index) {
        setDotIndexs(prev => {
          const index = prev.indexOf(options.index);
          const next = [...prev];
          if (index !== -1) {
            next.splice(index, 1)
          }
          return next;
        })
      }

      if (typeof options?.success === 'function') {
        options.success({ errMsg: '' })
      }
      if (typeof options?.complete === 'function') {
        options.complete({ errMsg: '' })
      }
    })
  }, [])

  return { dotIndexs }
}

export const useToggleShow = () => {
  const [show, setShow] = useState(true);
  const [withAnimation, setWithAnimation] = useState(false);

  useEffect(() => {
    eventEmitter.on('setTabBarToggle', (newShow: boolean, options?: Parameters<BaseApis['showTabBar']>[0]): void => {
      setShow(newShow);
      setWithAnimation(!!options?.animation)

      if (typeof options?.success === 'function') {
        options.success({ errMsg: '' })
      }
      if (typeof options?.complete === 'function') {
        options.complete({ errMsg: '' })
      }
    })
  }, [])

  return { show, withAnimation }
}

export const useSelectTab = (tab?: TabBarProps) => {
  const history = useHistory();
  const getIndex = () => tab?.list?.findIndex(v => formatPath(v.pagePath) === history.location.pathname);
  const [current, setCurrent] = useState(getIndex());
  const onSelect = (url: string) => {
    redirectTo({ url: formatPath(url) })
    setCurrent(getIndex())
  }
  
  return { currentIndex: current, setCurrent: onSelect }
}
