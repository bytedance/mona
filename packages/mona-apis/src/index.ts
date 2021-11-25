import ApiAdapter from "./ApiAdapter";
import Api from './Api';
export const BaseApi = Api;

const apiAdapterInstance = new ApiAdapter({ env: 'mini' }).apiInstance!;

export const showToast = apiAdapterInstance.showToast;