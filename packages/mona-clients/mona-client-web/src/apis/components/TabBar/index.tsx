import React, { FC, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useTabBarHandle, MONA_WEB_TAB_BAR_HANDLE } from './utils';
import formatPath from '../../../utils/formatPath';
import { hide } from '../util';
import './index.module.less';

export { MONA_WEB_TAB_BAR_HANDLE };

export interface TabBarProps {
  color: string;
  selectedColor: string;
  backgroundColor: string;
  borderStyle?: 'black' | 'white';
  list: {
    pagePath: string;
    iconPath?: string;
    selectedIconPath?: string;
    text: string;
    dot?: boolean;
    badgeText?: string;
  }[];
}

const MONA_WEB_TAB_BAR = 'mona-web-tab-bar';

export const TabBar: FC<{ tab: TabBarProps }> = props => {
  const { tab } = useTabBarHandle(props);
  const [pos, setPos] = useState(0);

  const selected = useCallback(
    (path, i) => {
      setPos(i);
      history.pushState(null, '', formatPath(path));
    },
    [pos]
  );

  return (
    <div className="mona-web-tabbar" style={{ backgroundColor: tab.backgroundColor }}>
      {tab.list.map((v, idx) => (
        <div
          key={idx}
          className="mona-web-tabbar-item"
          onClick={() => selected(v.pagePath, idx)}
          style={{ color: tab.color || 'red' }}
        >
          <div className="mona-web-tabbar-item-badge">
            <img
              className="mona-web-tabbar-item-badge-img"
              src={pos === idx ? v.selectedIconPath : v.iconPath}
              alt={v.text}
            />
            {v.badgeText ? (
              <span className="mona-web-tabbar-item-badge-text">{v.badgeText.length > 3 ? '...' : v.badgeText}</span>
            ) : (
              <>{v.dot && <span className="mona-web-tabbar-item-badge-dot" />}</>
            )}
          </div>
          <p style={{ color: pos === idx ? tab.selectedColor : '' }} className="mona-web-tabbar-item-text">
            {v.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export const webHideTabBar = () => hide(MONA_WEB_TAB_BAR);

export function webShowTabBar(props: TabBarProps) {
  // if current node exists. not render
  if (!document.getElementById(MONA_WEB_TAB_BAR)) {
    const container = document.createElement('div');
    container.id = MONA_WEB_TAB_BAR;
    document.body.append(container);

    setTimeout(() => {
      ReactDOM.render(<TabBar tab={props} />, container);
    });
  }
}
