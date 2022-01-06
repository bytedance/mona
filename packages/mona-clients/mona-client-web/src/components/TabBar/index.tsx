import React, { FC } from 'react';
// import ReactDOM from 'react-dom';
import { MONA_WEB_TAB_BAR_HANDLE, useSelectTab } from './utils';
import styles from './index.module.less';

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

// const MONA_WEB_TAB_BAR = 'mona-web-tab-bar';

const TabBar: FC<{ tab?: TabBarProps }> = ({ tab }) => {
  const { currentIndex, setCurrent } = useSelectTab(tab);
  

  if (!tab || tab.list.length <= 0) {
    return null
  }

  return (
    <div className={styles.container} style={{ backgroundColor: tab?.backgroundColor || '#fff' }}>
      {tab.list.map((v, idx) => (
        <div
          key={idx}
          className={styles.item}
          onClick={() => setCurrent(v.pagePath)}
          style={{ color: tab?.color || 'red' }}
        >
          <div className={styles.badge}>
            <img
              className={styles.image}
              src={currentIndex === idx ? v.selectedIconPath : v.iconPath}
            />
            {v.badgeText ? (
              <span className={styles.text}>{v.badgeText.length > 3 ? '...' : v.badgeText}</span>
            ) : (
              <>{v.dot && <span className={styles.dot} />}</>
            )}
          </div>
          <div style={{ color: currentIndex === idx ? tab?.selectedColor : '' }} className={styles.desc}>
            {v.text}
          </div>
        </div>
      ))}
    </div>
  );
};

// export const webHideTabBar = () => hide(MONA_WEB_TAB_BAR);

// export function webShowTabBar(props: TabBarProps) {
//   // if current node exists. not render
//   if (!document.getElementById(MONA_WEB_TAB_BAR)) {
//     const container = document.createElement('div');
//     container.id = MONA_WEB_TAB_BAR;
//     document.body.append(container);

//     setTimeout(() => {
//       ReactDOM.render(<TabBar tab={props} />, container);
//     });
//   }
// }

export default TabBar;