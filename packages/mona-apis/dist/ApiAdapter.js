// @ts-nocheck
import { api as miniApi } from '@bytedance/mona-client-mini';
var ApiAdapter = /** @class */ (function () {
    function ApiAdapter(_a) {
        var env = _a.env;
        this.env = env;
        switch (env) {
            case 'mini':
                this.apiInstance = miniApi;
                break;
            // case 'plugin':
            //   this.apiInstance = pluginApi;
            //   break;
            // case 'web':
            default:
                this.apiInstance = miniApi;
        }
    }
    return ApiAdapter;
}());
export default ApiAdapter;
//# sourceMappingURL=ApiAdapter.js.map