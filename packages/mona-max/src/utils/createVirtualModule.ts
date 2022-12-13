import path from 'path';
import VirtualModulesPlugin from 'webpack-virtual-modules';

function _generatePluginEntryCode(id) {
  const code = `
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

export default function createModule(id) {
  const entryPath = path.resolve(process.cwd(), './src/index');
  const module = {};
  const virtualPath = path.join(entryPath, '..', 'app.entry.js');
  module[virtualPath] = _generatePluginEntryCode(id);
  return new VirtualModulesPlugin(module);
}
