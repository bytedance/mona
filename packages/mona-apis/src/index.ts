import adapter from "./adapter";

// BUILD_TARGET will inject by DefinePlugin
const api = adapter(BUILD_TARGET);

const {
  showToast,
} = api;

export { showToast }