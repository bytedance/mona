interface PxtransformConfig {
  onePxTransform: boolean,
  unitPrecision: number,
  propList: string[],
  selectorBlackList: (string | RegExp)[],
  replace: boolean,
  mediaQuery: boolean,
  minPixelValue: number,
  exclude: RegExp | null | ((name: string) => boolean)
}

interface PostcssPxtransformProps {
  enable: boolean;
  designWidth?: 750 | 640 | 828;
  deviceRatio?: { [key: string]: number }
  config?: Partial<PxtransformConfig>;
}

export interface ProjectConfig {
  projectName: string;
  appId?: string;
  input: string;
  output: string;
  enableMultiBuild?: boolean;
  compilerOptimization?: boolean;
  raw?: (options: any) => any;
  dev?: {
    port?: number | string;
  },
  postcss?: {
    pxtransform?: PostcssPxtransformProps
  }
}

export function createProjectConfig(projectConfig: ProjectConfig) {
  return projectConfig;
}
