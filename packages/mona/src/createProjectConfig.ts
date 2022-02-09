import { PluginOptions } from 'copy-webpack-plugin';
import Config from 'webpack-chain';
import { Configuration } from 'webpack';
interface PxtransformConfig {
  unitPrecision: number;
  propList: string[];
  selectorBlackList: (string | RegExp)[];
  replace: boolean;
  mediaQuery: boolean;
  minPixelValue: number;
  exclude: RegExp | null | ((name: string) => boolean);
}

interface PostcssPxtransformProps {
  enable: boolean;
  designWidth?: number;
  deviceRatio?: { [key: string]: number };
  config?: Partial<PxtransformConfig>;
}

export interface ProjectConfig {
  projectName: string;
  appId?: string;
  input: string;
  output: string;
  enableMultiBuild?: boolean;
  compilerOptimization?: boolean;
  transformSvgToComponentInWeb?: boolean;
  abilities?: {
    define?: Record<string, string>;
    copy?: PluginOptions;
    css?: {
      postcss?: {
        pxtransform?: PostcssPxtransformProps;
      };
    };

    // default: false
    sourceMap?: Config.DevTool;
    // default: { "@": "./src/" }
    alias?: Record<string, string>;
  };
  raw?: (config: Configuration) => Configuration;
  chain?: (config: Config) => void;
  dev?: {
    port?: number | string;
  };
}

export function createProjectConfig(projectConfig: ProjectConfig) {
  return projectConfig;
}
