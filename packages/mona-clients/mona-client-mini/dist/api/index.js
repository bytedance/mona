import { promisify } from '../utils/promisify';
// import { BaseApi } from '@bytedance/mona-apis'
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.prototype.showToast = function (params) {
        return promisify(tt.showToast)(params);
    };
    return Api;
}());
export default Api;
//# sourceMappingURL=index.js.map