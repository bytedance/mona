import React, { FC, useEffect, useRef } from 'react';
import { useBadge, useSelectTab, useTabProps, useToggleDotShow, useToggleShow } from './utils';
import styles from './index.module.less';

export type TabBarProps = {
  color: string;
  selectedColor: string;
  backgroundColor: string;
  borderStyle?: 'black' | 'white';
  list: {
    pagePath: string;
    iconPath?: string;
    selectedIconPath?: string;
    text: string;
  }[];
};

const isAbsolute = (path: string): boolean => /^https?/.test(path) || /^\/\//.test(path);
function formatIconPath(path?: string) {
  if (!path) {
    return path;
  }
  return isAbsolute(path) ? path : ((window as any).__mona_public_path__ || '') + path;
}

function calcBorderStyle(color?: 'black' | 'white') {
  if (['black', 'white'].indexOf(color || '') === -1) {
    return 'tranparent';
  }
  return color;
}

const TabBar: FC<{ tab?: TabBarProps }> = ({ tab: rawTab }) => {
  const { tab } = useTabProps(rawTab);
  const { currentIndex, setCurrent } = useSelectTab(tab);
  const { badges } = useBadge();
  const { show, withAnimation } = useToggleShow();
  const { dotIndexs } = useToggleDotShow();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.body;
    const originPaddingBottom = el.style.paddingBottom;
    if (ref) {
      el.style.paddingBottom = `calc(${originPaddingBottom ?? '0px'} + ${ref.current?.offsetHeight ?? 0}px)`
    }

    return () => {
      el.style.paddingBottom = originPaddingBottom;
    };
  }, []);

  if (!tab || tab.list.length <= 0) {
    return null;
  }

  return (
    <div
      className={`${styles.container} ${!show ? styles.hidden : ''}`}
      ref={ref}
      style={{
        transition: withAnimation ? 'transform .2s linear' : 'noset',
        backgroundColor: tab?.backgroundColor || '#fff',
        borderColor: calcBorderStyle(tab?.borderStyle),
      }}
    >
      {tab.list.map((v, idx) => (
        <div
          key={idx}
          className={styles.item}
          onClick={() => setCurrent(v.pagePath)}
          style={{ color: tab?.color || 'black' }}
        >
          <div className={styles.badge}>
            <img className={styles.image} src={currentIndex === idx ? formatIconPath(v.selectedIconPath) : formatIconPath(v.iconPath)} />
            {dotIndexs.indexOf(idx) !== -1 && <span className={styles.redDot}></span>}
            {badges[idx] && <span className={styles.text}>{badges[idx].length > 3 ? '...' : badges[idx]}</span>}
          </div>
          <div style={{ color: currentIndex === idx ? tab?.selectedColor : '' }} className={styles.desc}>
            {v.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabBar;
