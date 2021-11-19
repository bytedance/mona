import React from 'react';
import { PageLifecycleGlobalContext, LifecycleContext, PageLifecycle } from './lifecycle/context';
import render from './reconciler';
import PageContainer from './reconciler/TaskController';
function createConfig(Component) {
    var config = {
        _pageLifecycleContext: new LifecycleContext(),
        _Component: Component,
        _container: new PageContainer({}),
        onLoad: function (options) {
            var element = React.createElement(this._Component, {}, []);
            var wrapper = React.createElement(PageLifecycleGlobalContext.Provider, { value: this._pageLifecycleContext }, [element]);
            this._container = new PageContainer(this);
            render(wrapper, this._container);
            this.$callLifecycle(PageLifecycle.load, options);
        },
        onUnload: function () {
            this.$callLifecycle(PageLifecycle.unload);
        },
        onReady: function () {
            this.$callLifecycle(PageLifecycle.ready);
        },
        onShow: function (options) {
            this.$callLifecycle(PageLifecycle.show, options);
        },
        onHide: function () {
            this.$callLifecycle(PageLifecycle.hide);
        },
        onResize: function () {
            this.$callLifecycle(PageLifecycle.resize);
        },
        onPullDownRefresh: function () {
            this.$callLifecycle(PageLifecycle.pullDownRefresh);
        },
        onReachBottom: function () {
            this.$callLifecycle(PageLifecycle.reachBottom);
        },
        onShareAppMessage: function () {
            this.$callLifecycle(PageLifecycle.shareAppMessage);
        },
        onPageScroll: function () {
            this.$callLifecycle(PageLifecycle.pageScroll);
        },
        $callLifecycle: function (name, params) {
            var cbs = this._pageLifecycleContext.lifecycles[name];
            cbs.forEach(function (cb) {
                cb(params);
            });
        }
    };
    return config;
}
export default function createPage(Component) {
    var pageConfig = createConfig(Component);
    return Page(pageConfig);
}
//# sourceMappingURL=createPage.js.map