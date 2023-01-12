import fs from 'fs';
import merge from 'lodash.merge';
import path from 'path';
import Config from 'webpack-chain';

import { AppConfig, ProjectConfig as OriginProjectConfig } from '@bytedance/mona';
import { readConfig, searchScriptFile } from '@bytedance/mona-shared';

import { getConfigPath } from './commands/util';
import { DEFAULT_PORT } from './target/constants';
import { createUniqueId } from './target/utils/utils';

export type ProjectConfig = OriginProjectConfig & { output: string };

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
    runtime: {
      monaUi: false,
      openSafeSdk: false,
    },
    abilities: {
      define: {},
      copy: { patterns: [] },
      sourceMap: false as Config.DevTool,

      // sourceMap: 'eval-cheap-module-source-map' as Config.DevTool,
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
  // isDev: boolean;

  constructor() {
    this.cwd = process.cwd();
    this.readAllConfig();
    this.buildId = `_${createUniqueId()}`;
  }

  get isDev(): boolean {
    return process.env.NODE_ENV !== 'production';
  }

  readAllConfig() {
    const configFile = getConfigPath();
    this.projectConfig = merge(genDefaultProjectConfig(this.cwd), this._readConfig<ProjectConfig>(configFile));
    this.appConfig = merge(DEFAULT_APP_CONFIG, this._readConfig<AppConfig>('app.config'));
    this.entryPath = searchScriptFile(path.resolve(this.cwd, this.projectConfig.input));
  }

  private _readConfig<T>(configName: string): T {
    const projectConfigPath = path.join(this.cwd, configName);
    const fullConfigPath = searchScriptFile(projectConfigPath);
    if (fs.existsSync(fullConfigPath)) {
      const projectConfig = readConfig<T>(fullConfigPath);
      return projectConfig;
    }
    return {} as T;
  }
}

export default ConfigHelper;
