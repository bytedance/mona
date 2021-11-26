import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { formatPath } from './utils/formatPath';
import Link from './components/Link';
var WrapperComponent = function (_a) {
    var children = _a.children, title = _a.title;
    useEffect(function () {
        if (title) {
            document.title = title;
        }
        else {
            document.title = 'Mona Plugin';
        }
    }, [title]);
    return React.createElement(React.Fragment, null, children);
};
var NoMatch = function (_a) {
    var defaultPath = _a.defaultPath;
    return (React.createElement("div", { style: { position: 'relative', minHeight: '100vh' } },
        React.createElement("div", { style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                backgroundColor: 'rgba(255, 255, 255)',
            } },
            React.createElement("div", { style: {
                    color: '#0000008C',
                    fontSize: '14px',
                    textAlign: 'center',
                    lineHeight: '20px',
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                } },
                React.createElement("img", { style: { width: 320, marginBottom: 8 }, src: "https://lf3-fe.ecombdstatic.com/obj/ecom-open-butler/mona/error.png" }),
                React.createElement("div", null,
                    React.createElement("span", null,
                        "\u4E0D\u5B58\u5728\u8DEF\u7531 ",
                        location.pathname,
                        ' ',
                        React.createElement(Link, { to: defaultPath }, "\u8FD4\u56DE\u9996\u9875")))))));
};
function parseSearch(search) {
    if (!search || !/^\?/.test(search))
        return {};
    var rawSearch = search.replace(/^\?/, '').split('&');
    return rawSearch.reduce(function (r, s) {
        var _a = s.split('='), key = _a[0], value = _a[1];
        r[key] = value;
        return r;
    }, {});
}
export function createPlugin(Component, routes) {
    var render = function (_a) {
        var dom = _a.dom;
        ReactDOM.render(React.createElement(BrowserRouter, null,
            React.createElement(Component, null,
                React.createElement(Switch, null,
                    routes.map(function (route) { return (React.createElement(Route, { key: route.path, path: formatPath(route.path), children: function (_a) {
                            var location = _a.location;
                            return (React.createElement(WrapperComponent, { title: route.title },
                                React.createElement(route.component, { search: location.search, searchParams: parseSearch(location.search) })));
                        } })); }),
                    routes.length > 0 ? (React.createElement(Route, { exact: true, path: "/" },
                        React.createElement(Redirect, { to: formatPath(routes[0].path) }))) : null,
                    React.createElement(Route, { path: "*" },
                        React.createElement(NoMatch, { defaultPath: formatPath(routes[0].path) }))))), dom.querySelector('#root'));
    };
    // 在首次加载和执行时会触发该函数
    var provider = function () { return ({
        render: render,
        destroy: function (_a) {
            var dom = _a.dom;
            // 应用在销毁时会触发该 hook
            var root = (dom && dom.querySelector('#root')) || dom; // 若为 JS 入口直接将传入节点作为挂载点和销毁节点
            if (root) {
                // 做对应的销毁逻辑，保证子应用在销毁时对应的副作用也被移除
                ReactDOM.unmountComponentAtNode(root);
            }
        },
    }); };
    if (!window.__MARFISH__) {
        render({ dom: document });
    }
    return {
        provider: provider,
    };
}
//# sourceMappingURL=createPlugin.js.map