import ApiAdapter from "./ApiAdapter";

const apiAdapterInstance = new ApiAdapter({ env: 'mini' }).apiInstance;

export const api = apiAdapterInstance;
export { default as Api } from './Api';