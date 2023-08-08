import React from 'react';
import styles from './index.module.less';
const wrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  inset: 0,
  zIndex: 1,
  backgroundColor: 'rgb(255, 255, 255)',
};

const centerStyle: React.CSSProperties = {
  color: 'rgba(0, 0, 0, 0.55)',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
};

export const Loading: React.FC = () => {
  return (
    <div style={wrapperStyle}>
      <div style={centerStyle}>
        <img
          className={styles.loading}
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ3NzE1IDIgMiA2LjQ3NzE1IDIgMTJDMiAxNy41MjI4IDYuNDc3MTUgMjIgMTIgMjJDMTQuMzU0OSAyMiAxNi41MjIxIDIxLjE4NDggMTguMjMwOSAxOS44MjE5QzE4LjY2MjcgMTkuNDc3NiAxOC43MzM2IDE4Ljg0ODQgMTguMzg5MiAxOC40MTY2QzE4LjA0NDggMTcuOTg0OCAxNy40MTU2IDE3LjkxNCAxNi45ODM5IDE4LjI1ODNDMTUuNjE2NSAxOS4zNDg4IDEzLjg4NTcgMjAgMTIgMjBDNy41ODE3MiAyMCA0IDE2LjQxODMgNCAxMkM0IDcuNTgxNzIgNy41ODE3MiA0IDEyIDRDMTYuNDE4MyA0IDIwIDcuNTgxNzIgMjAgMTJDMjAgMTIuNTUyMyAyMC40NDc3IDEzIDIxIDEzQzIxLjU1MjMgMTMgMjIgMTIuNTUyMyAyMiAxMkMyMiA2LjQ3NzE1IDE3LjUyMjggMiAxMiAyWiIgZmlsbD0iIzE5NjZGRiIvPjwvc3ZnPg=="
          //@ts-ignore
          onError={e => e.target && (e.target.src = '')}
        />
      </div>
    </div>
  );
};
