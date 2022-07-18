import { AppConfig } from '@bytedance/mona';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import NavBar from './components/NavBar';
import TabBar from './components/TabBar';
import { formatPath, parseSearch, GLOBAL_LIFECYCLE_STORE } from '@bytedance/mona-shared';

export const WrapperComponent: React.FC<{ title: string }> = ({ children, title }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = 'Mona Web';
    }
  }, [title]);

  return <>{children}</>;
};

const maskStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  backgroundColor: 'rgba(255, 255, 255)',
};

const NoMatchImgWrapperStyle: React.CSSProperties = {
  color: '#0000008C',
  fontSize: '14px',
  textAlign: 'center',
  lineHeight: '20px',
  whiteSpace: 'nowrap',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

const imgStyle = { width: 320, marginBottom: 8 };
export const NoMatch: React.FC<{ defaultPath: string }> = ({ defaultPath }) => {
  const history = useHistory();
  useEffect(() => {
    // app生命周期pageNotFound
    //@ts-ignore
    window[GLOBAL_LIFECYCLE_STORE]?.handlePageNotFound?.(defaultPath);
  }, [defaultPath]);
  return (
    <div style={maskStyle}>
      <div style={NoMatchImgWrapperStyle}>
        <img style={imgStyle} src={'https://lf3-fe.ecombdstatic.com/obj/ecom-open-butler/mona/error.png'} />
        <div>
          <span>
            不存在路由 {location.pathname} <a onClick={() => history.push(formatPath(defaultPath))}>返回首页</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export interface PageProps {
  search: string;
  searchParams: Record<string, string>;
}

export const HistorySetWrapper: React.FC = ({ children }) => {
  const history = useHistory();

  // set global history to implement navigateTo and redirectTo api
  useEffect(() => {
    // @ts-ignore
    window.__mona_history = history;
  }, [history]);

  return <>{children}</>;
};

const defaultLightConfig: AppConfig['light'] = { mode: 'sidebar-semi-420' };

function prepareLightApp(config: AppConfig['light']) {
  // @ts-ignore
  if (typeof window.__MONA_LIGHT_APP_INIT_CB === 'function') {
    // @ts-ignore
    window.__MONA_LIGHT_APP_INIT_CB({ ...defaultLightConfig, ...config });
    // @ts-ignore
    window.__MONA_LIGHT_APP_INIT_CB = undefined;
  }
}

export function createWebApp(
  Component: React.ComponentType<any>,
  routes: { path: string; title: string; component: React.ComponentType<any> }[],
  options?: {
    tabBar?: AppConfig['tabBar'],
    navBar?: AppConfig['window'],
    defaultPath?: string
    light?: AppConfig['light']
  }
) {
  const render = ({ dom }: { dom: Element | Document }) => {
    prepareLightApp(options?.light)

    ReactDOM.render(
      <BrowserRouter>
        <HistorySetWrapper>
          <Component>
            {options?.navBar && <NavBar {...options?.navBar} />}
            <Switch>
              {routes?.map(route => (
                <Route
                  key={route.path}
                  path={formatPath(route.path)}
                  children={({ location }) => (
                    <WrapperComponent title={route.title}>
                      <route.component search={location.search} searchParams={parseSearch(location.search)} />
                    </WrapperComponent>
                  )}
                />
              ))}
              {routes?.length && (
                <Route exact path="/">
                  <Redirect to={formatPath(routes[0].path || options?.defaultPath || '/')} />
                </Route>
              )}
              <Route path="*">
                <NoMatch defaultPath={formatPath(routes[0].path || options?.defaultPath || '/')} />
              </Route>
            </Switch>
            {options?.tabBar && <TabBar tab={options?.tabBar} />}
          </Component>
        </HistorySetWrapper>
      </BrowserRouter>,
      dom.querySelector('#root'),
    );
  };

  // 在首次加载和执行时会触发该函数
  const provider = () => ({
    render, // 应用在渲染时会触发该 hook
    destroy({ dom }: { dom: Element }) {
      // 应用在销毁时会触发该 hook
      const root = (dom && dom.querySelector('#root')) || dom; // 若为 JS 入口直接将传入节点作为挂载点和销毁节点
      if (root) {
        // 做对应的销毁逻辑，保证子应用在销毁时对应的副作用也被移除
        ReactDOM.unmountComponentAtNode(root);
      }
    },
  });

  if (!window.__MARFISH__) {
    render({ dom: document });
  }

  return {
    provider,
  };
}
