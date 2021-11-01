import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { formatPath } from './utils/formatPath';
import Link from '@/components/Link';

const WrapperComponent: React.FC<{ title: string }> = ({ children, title }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = 'Mona Plugin'
    }
  }, [title])

  return <>{children}</>
}

const NoMatch: React.FC<{ defaultPath: string }>  = ({ defaultPath }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255)',
        }}
      >
        <div
          style={{
            color: '#0000008C',
            fontSize: '14px',
            textAlign: 'center',
            lineHeight: '20px',
            whiteSpace: 'nowrap',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <img
            style={{ width: 320, marginBottom: 8 }}
            src={`https://lf3-fe.ecombdstatic.com/obj/ecom-open-butler/mona/error.png`}
          />
          <div>
            <span>
              不存在路由 {location.pathname}{' '}
              <Link to={defaultPath}>
               返回首页
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function parseSearch(search: string): Record<string, string> {
  if (!search || !/^\?/.test(search)) return {};
  const rawSearch = search.replace(/^\?/, '').split('&');
  return rawSearch.reduce((r, s) => {
    const [key, value] = s.split('=');
    r[key] = value;
    return r;
  }, {} as Record<string, string>)
}

export interface PageProps {
  search: string;
  searchParams: Record<string, string>
}

export function createPlugin(
  Component: React.ComponentType<any>,
  routes: { path: string; title: string; component: React.ComponentType<any> }[]
) {
  const render = ({ dom }: { dom: Element | Document }) => {
    ReactDOM.render(
      <BrowserRouter>
        <Component>
          <Switch>
            {routes.map(route => (
              <Route key={route.path} path={formatPath(route.path)} children={({ location }) => (
                <WrapperComponent title={route.title}>
                  <route.component search={location.search} searchParams={parseSearch(location.search)} />
                </WrapperComponent>
              )} />
            ))}
              {routes.length > 0 ? (
                <Route exact path="/">
                  <Redirect to={formatPath(routes[0].path)} />
                </Route>
              ) : null}
            <Route path="*">
              <NoMatch defaultPath={formatPath(routes[0].path)} />
            </Route>
          </Switch>
        </Component>
      </BrowserRouter>,
      dom.querySelector('#root')
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

  if (!(window as any).__MARFISH__) {
    render({ dom: document });
  }

  return {
    provider,
  };
}
