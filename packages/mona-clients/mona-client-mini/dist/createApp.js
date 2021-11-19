import React from 'react';
import { appLifecycleContext } from './lifecycle/hooks';
import { AppLifecycle } from './lifecycle/context';
import render from './reconciler';
var AppConfig = /** @class */ (function () {
    function AppConfig(Component) {
        this._container = {};
        this._Component = Component;
    }
    AppConfig.prototype.onLaunch = function (options) {
        render(React.createElement(this._Component, {}, []), this._container);
        this._callLifecycle(AppLifecycle.lanuch, options);
    };
    AppConfig.prototype.onShow = function (options) {
        this._callLifecycle(AppLifecycle.show, options);
    };
    AppConfig.prototype.onHide = function () {
        this._callLifecycle(AppLifecycle.hide);
    };
    AppConfig.prototype.onError = function (msg) {
        this._callLifecycle(AppLifecycle.error, msg);
    };
    AppConfig.prototype.onPageNotFound = function (msg) {
        this._callLifecycle(AppLifecycle.pageNodeFound, msg);
    };
    AppConfig.prototype._callLifecycle = function (name, params) {
        var cbs = appLifecycleContext.lifecycles[name];
        cbs.forEach(function (cb) {
            cb(params);
        });
    };
    return AppConfig;
}());
export default function createApp(Component) {
    var appConfig = new AppConfig(Component);
    return App(appConfig);
}
//# sourceMappingURL=createApp.js.map