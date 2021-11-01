export interface ProjectConfig {
    projectName: string;
    appId?: string;
    input: string;
    output: string;
}
export declare function createProjectConfig(projectConfig: ProjectConfig): ProjectConfig;
