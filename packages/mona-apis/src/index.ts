import adapter from "./adapter";

// BUILD_TARGET will inject by DefinePlugin
const apis = adapter(BUILD_TARGET);

const {
  showToast,
} = apis;

export { showToast }