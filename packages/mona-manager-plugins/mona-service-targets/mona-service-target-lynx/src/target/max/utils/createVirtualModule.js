const VirtualModulesPlugin = require('webpack-virtual-modules');
const path = require('path');
const fs = require('fs');

module.exports = function createModule(entry, id, useWebExt) {
  const module = {};
  const virtualPath = path.join(entry, '..', 'app.entry.js');
  module[virtualPath] = _generatePluginEntryCode(entry, id, useWebExt);
  return new VirtualModulesPlugin(module);
};

/**
 * 获取文件的实际扩展名
 * @param {string} dirPath - 目录路径
 * @param {string} baseName - 基础文件名（不包含扩展名）
 * @returns {string} 实际的文件扩展名
 */
function getActualFileExtension(dirPath, baseName) {
  const possibleExtensions = ['.jsx', '.tsx', '.js', '.ts'];

  for (const ext of possibleExtensions) {
    const filePath = path.join(dirPath, `${baseName}${ext}`);
    if (fs.existsSync(filePath)) {
      return ext;
    }
  }

  // 如果没有找到文件，默认使用 .jsx
  return '.jsx';
}

function _generatePluginEntryCode(entry, id, useWebExt) {
  const entryDir = path.dirname(entry);

  // 获取 index 文件的实际扩展名
  const actualExtension = getActualFileExtension(entryDir, 'index');

  // 获取 index.web 文件的实际扩展名
  const webExtension = getActualFileExtension(entryDir, 'index.web');

  const code = useWebExt
    ? `
    import React from 'react';
    import ErrorBoundary from './index.web${webExtension}';
    const Entry = React.forwardRef((props, ref) => (
      <ErrorBoundary ref={ref} buildId="${id}" dataSource={props} />
    ));
    export default Entry;
  `
    : `
    import React from 'react';
    import App from './index${actualExtension}';
    import ReactDOM from 'react-dom';
    import { ErrorBoundary } from 'react-error-boundary';

    function ErrorFallback({error, resetErrorBoundary}) {
      return (
        <div role="alert">
          <div>Something went wrong:</div>
          <div>{error.message}</div>
          <button onClick={resetErrorBoundary}>重试</button>
        </div>
      )
    }

    const MyComp = React.forwardRef((props, ref) => (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div id="${id}">
          <App ref={ref} {...props}/>
        </div>
      </ErrorBoundary>
    ));
    export default MyComp;
  `;
  return code;
}