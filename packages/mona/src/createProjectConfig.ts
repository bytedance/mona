export interface ProjectConfig {
  projectName: string;
  appId?: string;
  input: string;
  output: string;
  compilerOptimization?: boolean;
  raw?: (options: any) => any;
  dev?: {
    port?: number | string;
  };
}

export function createProjectConfig(projectConfig: ProjectConfig) {
  return projectConfig;
}
