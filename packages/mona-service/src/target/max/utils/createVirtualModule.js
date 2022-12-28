const VirtualModulesPlugin = require('webpack-virtual-modules');
const path = require('path');

module.exports = function createModule(entry, id, useWebExt) {
  const module = {};
  const virtualPath = path.join(entry, '..', 'app.entry.js');
  module[virtualPath] = _generatePluginEntryCode(id, useWebExt);
  return new VirtualModulesPlugin(module);
};

function _generatePluginEntryCode(id, useWebExt) {
  const code = useWebExt ? `
    import ErrorBoundary from './index.web'
    export default function Entry(props) { return <ErrorBoundary buildId="${id}" dataSource={props} />}
  ` :`
    import App from './index'
    import ReactDOM from 'react-dom'
    import { ErrorBoundary } from 'react-error-boundary'

    function ErrorFallback({error, resetErrorBoundary}) {
      return (
        <div role="alert">
          <div>Something went wrong:</div>
          <div>{error.message}</div>
          <button onClick={resetErrorBoundary}>重试</button>
        </div>
      )
    }

    function myComp (props) {
      return <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div id="${id}">
          <App {...props}/>
        </div>
      </ErrorBoundary>
    }
    export default myComp;
  `;
  return code;
}
