import ApiAdapter from "./ApiAdapter";
export { default as BaseApi } from './Api';
// BUILD_TARGET will inject by DefinePlugin
var apiAdapterInstance = new ApiAdapter({ env: BUILD_TARGET }).apiInstance;
var showToast = apiAdapterInstance.showToast;
export { showToast };
//# sourceMappingURL=index.js.map