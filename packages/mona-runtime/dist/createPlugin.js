"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlugin = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_router_dom_1 = require("react-router-dom");
const formatPath_1 = require("./utils/formatPath");
const Link_1 = __importDefault(require("./components/Link"));
const WrapperComponent = ({ children, title }) => {
    (0, react_1.useEffect)(() => {
        if (title) {
            document.title = title;
        }
        else {
            document.title = 'Mona Plugin';
        }
    }, [title]);
    return react_1.default.createElement(react_1.default.Fragment, null, children);
};
const NoMatch = ({ defaultPath }) => {
    return (react_1.default.createElement("div", { style: { position: 'relative', minHeight: '100vh' } },
        react_1.default.createElement("div", { style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                backgroundColor: 'rgba(255, 255, 255)',
            } },
            react_1.default.createElement("div", { style: {
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
                react_1.default.createElement("img", { style: { width: 320, marginBottom: 8 }, src: `https://lf3-fe.ecombdstatic.com/obj/ecom-open-butler/mona/error.png` }),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null,
                        "\u4E0D\u5B58\u5728\u8DEF\u7531 ",
                        location.pathname,
                        ' ',
                        react_1.default.createElement(Link_1.default, { to: defaultPath }, "\u8FD4\u56DE\u9996\u9875")))))));
};
function parseSearch(search) {
    if (!search || !/^\?/.test(search))
        return {};
    const rawSearch = search.replace(/^\?/, '').split('&');
    return rawSearch.reduce((r, s) => {
        const [key, value] = s.split('=');
        r[key] = value;
        return r;
    }, {});
}
function createPlugin(Component, routes) {
    const render = ({ dom }) => {
        react_dom_1.default.render(react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
            react_1.default.createElement(Component, null,
                react_1.default.createElement(react_router_dom_1.Switch, null,
                    routes.map(route => (react_1.default.createElement(react_router_dom_1.Route, { key: route.path, path: (0, formatPath_1.formatPath)(route.path), children: ({ location }) => (react_1.default.createElement(WrapperComponent, { title: route.title },
                            react_1.default.createElement(route.component, { search: location.search, searchParams: parseSearch(location.search) }))) }))),
                    routes.length > 0 ? (react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: "/" },
                        react_1.default.createElement(react_router_dom_1.Redirect, { to: (0, formatPath_1.formatPath)(routes[0].path) }))) : null,
                    react_1.default.createElement(react_router_dom_1.Route, { path: "*" },
                        react_1.default.createElement(NoMatch, { defaultPath: (0, formatPath_1.formatPath)(routes[0].path) }))))), dom.querySelector('#root'));
    };
    // 在首次加载和执行时会触发该函数
    const provider = () => ({
        render,
        destroy({ dom }) {
            // 应用在销毁时会触发该 hook
            const root = (dom && dom.querySelector('#root')) || dom; // 若为 JS 入口直接将传入节点作为挂载点和销毁节点
            if (root) {
                // 做对应的销毁逻辑，保证子应用在销毁时对应的副作用也被移除
                react_dom_1.default.unmountComponentAtNode(root);
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
exports.createPlugin = createPlugin;
//# sourceMappingURL=createPlugin.js.map