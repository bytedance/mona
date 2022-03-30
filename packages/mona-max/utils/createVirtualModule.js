const VirtualModulesPlugin = require('webpack-virtual-modules')
const path = require("path");

module.exports = function createModule(id) {
  const entryPath = path.resolve(process.cwd(), "./src/index")
  const module = {};
  const virtualPath = path.join(entryPath, '..', 'app.entry.js')
  module[virtualPath] = _generatePluginEntryCode(id);
  return new VirtualModulesPlugin(module);
}


function _generatePluginEntryCode(id) {
  const code = `
    import App from './index'
    function myComp (props) {
        return (
            <div id="_${id}">
              <App {...props}/>
            </div>
        )
    }
    export default myComp;
  `;
  return code;
}