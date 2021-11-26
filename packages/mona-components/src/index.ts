import adapter from './adapter';

export * from './baseComponents';
export * from './baseComponents/prop';

// BUILD_TARGET will inject by DefinePlugin
const comonents = adapter(BUILD_TARGET);

const {
  Button: TestButton
} = comonents;

export { TestButton }