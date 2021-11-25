import ApiAdapter from "./ApiAdapter";
import Api from './Api';
export var BaseApi = Api;
var apiAdapterInstance = new ApiAdapter({ env: 'mini' }).apiInstance;
export var showToast = apiAdapterInstance.showToast;
//# sourceMappingURL=index.js.map