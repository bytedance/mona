/**
 * easybox is a light sandbox for webapp
 * author: xwchris
 */
import importHTML from 'import-html-entry';
import Sandbox from './sandbox';

interface EasyboxOptions {
  scope?: string;
}
class Easybox {
  entry: string;
  options: EasyboxOptions;

  constructor(entry: string, options?: EasyboxOptions) {
    this.entry = entry;
    this.options = options || {};
  }

  async run() {
    // parse entry
    const { execScripts, ...rest } = await importHTML(this.entry);
    console.log('rest', rest);
    // create sandbox
    const storageScope = this.options.scope || '';
    const sandbox = new Sandbox({ storageScope });
    const global = sandbox.global;
    // exec script
    await execScripts(global, false)
  }
}

export default Easybox;