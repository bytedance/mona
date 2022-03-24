/**
 * easybox is a light sandbox for webapp
 * author: xwchris
 */
import importHTML from 'import-html-entry';
import Sandbox from './sandbox';

class Easybox {
  entry: string;

  constructor(entry: string) {
    this.entry = entry;
  }
  

  execScript() {

  }

  async run() {
    // parse entry
    const { execScripts, assetPublicPath } = await importHTML(this.entry);
    // create sandbox
    const sandbox = new Sandbox();
    const global = sandbox.global;
    // exec script
    const res = await execScripts(global, false)
  }
}

export default Easybox;