import { ConfigHelper } from '@bytedance/mona-manager';
import { Compiler } from 'webpack';
import fs from 'fs';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
const PUBLIC_PATH_NAME = 'public';

class CopyPublicPlugin {
  configHelper: ConfigHelper;
  pluginName = 'CopyPublicPlugin';
  patterns?: CopyWebpackPlugin.Pattern[];

  constructor(configHelper: ConfigHelper, patterns?: CopyWebpackPlugin.Pattern[]) {
    this.configHelper = configHelper;
    this.patterns = patterns;
  }

  apply(compiler: Compiler) {
    const { cwd, projectConfig } = this.configHelper;
    const publicPath = path.join(cwd, PUBLIC_PATH_NAME);
    const { patterns = [], options } = projectConfig?.abilities?.copy || { patterns: [] };

    if (fs.existsSync(publicPath)) {
      const outputPath = path.join(cwd, projectConfig.output);
      patterns.unshift({ from: publicPath, to: outputPath });
    }
    if (this.patterns) {
      patterns.unshift(...this.patterns);
    }
    patterns.length && new CopyWebpackPlugin({ patterns, options }).apply(compiler);
  }
}

export default CopyPublicPlugin;
