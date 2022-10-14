import React, { Suspense } from 'react';

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
const imgStyle: React.CSSProperties = {
  width: '64%',
  // margin-bottom: 5.333%;
  display: 'inline-block',
};
export const Loading: React.FC = () => {
  return (
    <div style={wrapperStyle}>
      <div style={centerStyle}>
        <img
          style={imgStyle}
          src={'https://lf3-fe.ecombdstatic.com/obj/ecom-open-butler/mona/error.png'}
          //@ts-ignore
          onError={e => e.target && (e.target.src = '')}
        />
        <div className="mona-empty-desc">loading...</div>
      </div>
    </div>
  );
};

export function lazy<T>(factory: () => Promise<{ default: React.ComponentType<T> }>) {
  const Component = React.lazy(factory);
  return (props: T) => (
    <Suspense fallback={<Loading />}>
      <Component {...(props as any)} />
    </Suspense>
  );
}
