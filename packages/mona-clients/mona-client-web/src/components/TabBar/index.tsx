import React, { FC } from 'react';
import cs from 'classnames';
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
  const { badges } = useBadge()
  const { show, withAnimation } = useToggleShow()
  const { dotIndexs } = useToggleDotShow();

  if ((!tab || tab.list.length <= 0)) {
    return null
  }

  return (
    <div className={cs(styles.container, { [styles.hidden]: !show })} style={{ transition: withAnimation ? 'transform .2s linear' : 'noset', backgroundColor: tab?.backgroundColor || '#fff', borderColor: calcBorderStyle(tab?.borderStyle)}}>
      {tab.list.map((v, idx) => (
        <div
          key={idx}
          className={styles.item}
          onClick={() => setCurrent(v.pagePath)}
          style={{ color: tab?.color || 'black' }}
        >
          <div className={styles.badge}>
            <img
              className={styles.image}
              src={currentIndex === idx ? v.selectedIconPath : v.iconPath}
            />
            { dotIndexs.indexOf(idx) !== -1 && <span className={styles.redDot}></span>}
            { badges[idx] && <span className={styles.text}>{badges[idx].length > 3 ? '...' : badges[idx] }</span> }
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