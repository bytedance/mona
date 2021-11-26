import adapter from "./adapter";
// BUILD_TARGET will inject by DefinePlugin
var api = adapter(BUILD_TARGET);
var showToast = api.showToast;
export { showToast };
//# sourceMappingURL=index.js.map