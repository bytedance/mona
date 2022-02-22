import path from 'path';
import fs from 'fs';
import { AppConfig, ProjectConfig } from '@bytedance/mona';
import { readConfig, searchScriptFile } from '@bytedance/mona-shared';
import { DEFAULT_PORT } from './target/constants';
import { createUniqueId } from './target/utils/utils';
import { merge } from 'lodash';

const genDefaultProjectConfig = (cwd: string): ProjectConfig => {
  return {
    projectName: 'mona-app',
    input: './src/app',
    output: 'dist',
    compilerOptimization: true,
    enableMultiBuild: true,
    dev: {
      port: DEFAULT_PORT,
    },
    abilities: {
      define: {},
      copy: { patterns: [] },
      sourceMap: false,
      alias: {
        '@': path.resolve(cwd, './src'),
      },
    },
  };
};

const DEFAULT_APP_CONFIG: AppConfig = {
  pages: [],
};

class ConfigHelper {
  cwd: string;
  projectConfig!: ProjectConfig;
  appConfig!: AppConfig;
  entryPath!: string;
  buildId: string;
  isDev: boolean;

  constructor() {
    this.cwd = process.cwd();
    this.readAllConfig();
    this.buildId = `_${createUniqueId()}`;
    this.isDev = process.env.NODE_ENV !== 'production';
  }

  readAllConfig() {
    this.projectConfig = merge(genDefaultProjectConfig(this.cwd), this._readConfig<ProjectConfig>('mona.config'));
    this.appConfig = merge(DEFAULT_APP_CONFIG, this._readConfig<AppConfig>('app.config'));
    this.entryPath = searchScriptFile(path.resolve(this.cwd, this.projectConfig.input));
  }

  private _readConfig<T>(configName: string): T {
    const projectConfigPath = path.join(this.cwd, configName);
    const fullConfigPath = searchScriptFile(projectConfigPath);
    if (fs.existsSync(fullConfigPath)) {
      const projectConfig = readConfig<T>(fullConfigPath);
      return projectConfig;
    } else {
      throw new Error('无效的项目目录，请在mona项目根目录执行命令');
    }
  }
}

export default ConfigHelper;
