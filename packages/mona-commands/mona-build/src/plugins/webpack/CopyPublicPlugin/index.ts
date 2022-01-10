import { ConfigHelper } from '@/configHelper';
import { Compiler } from 'webpack';
import fs from 'fs';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
const PUBLIC_PATH_NAME = 'public';

class CopyPublicPlugin {
  configHelper: ConfigHelper;
  pluginName = 'CopyPublicPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    const { cwd, projectConfig } = this.configHelper;
    const publicPath = path.join(cwd, PUBLIC_PATH_NAME);
    if (fs.existsSync(publicPath)) {
      const outputPath = path.join(cwd, projectConfig.output);
      new CopyWebpackPlugin({ patterns: [{ from: publicPath, to: outputPath }] }).apply(compiler)
    }
  }
}

export default CopyPublicPlugin;
