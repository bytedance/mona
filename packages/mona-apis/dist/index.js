import ApiAdapter from "./ApiAdapter";
var apiAdapterInstance = new ApiAdapter({ env: 'mini' }).apiInstance;
export var api = apiAdapterInstance;
export { default as Api } from './Api';
//# sourceMappingURL=index.js.map