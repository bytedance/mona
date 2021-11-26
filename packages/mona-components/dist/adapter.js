import { Components as MiniComponents } from '@bytedance/mona-client-mini';
export default function adapter(env) {
    var components;
    switch (env) {
        case 'mini':
        default:
            components = new MiniComponents();
        //   break;
        // case 'plugin':
        //   api = new PluginApi();
        //   break;
        // case 'web':
        // default:
        //   api = new WebApi();
    }
    return components;
}
//# sourceMappingURL=adapter.js.map