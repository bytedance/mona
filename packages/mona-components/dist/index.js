import adapter from './adapter';
export * from './baseComponents';
export * from './baseComponents/prop';
// BUILD_TARGET will inject by DefinePlugin
var comonents = adapter(BUILD_TARGET);
var TestButton = comonents.Button;
export { TestButton };
//# sourceMappingURL=index.js.map