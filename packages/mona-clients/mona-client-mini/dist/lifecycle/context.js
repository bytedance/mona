import React from 'react';
export var AppLifecycle;
(function (AppLifecycle) {
    AppLifecycle["lanuch"] = "lanuch";
    AppLifecycle["show"] = "show";
    AppLifecycle["hide"] = "hide";
    AppLifecycle["error"] = "error";
    AppLifecycle["pageNodeFound"] = "pageNodeFound";
})(AppLifecycle || (AppLifecycle = {}));
export var PageLifecycle;
(function (PageLifecycle) {
    PageLifecycle["load"] = "load";
    PageLifecycle["ready"] = "ready";
    PageLifecycle["show"] = "show";
    PageLifecycle["hide"] = "hide";
    PageLifecycle["unload"] = "unload";
    PageLifecycle["resize"] = "resize";
    PageLifecycle["pullDownRefresh"] = "pullDownRefresh";
    PageLifecycle["reachBottom"] = "reachBottom";
    PageLifecycle["shareAppMessage"] = "shareAppMessage";
    PageLifecycle["pageScroll"] = "pageScroll";
})(PageLifecycle || (PageLifecycle = {}));
var LifecycleContext = /** @class */ (function () {
    function LifecycleContext() {
        this.lifecycles = {};
    }
    LifecycleContext.prototype.registerLifecycle = function (rawName, callback) {
        if (typeof callback !== 'function') {
            return;
        }
        var name = rawName.toLowerCase().replace(/^on/, '');
        this.lifecycles[name] = this.lifecycles[name] || [];
        this.lifecycles[name].push(callback);
    };
    return LifecycleContext;
}());
export { LifecycleContext };
export var PageLifecycleGlobalContext = React.createContext(null);
//# sourceMappingURL=context.js.map