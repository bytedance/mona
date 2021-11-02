export interface ProjectConfig {
    projectName: string;
    appId?: string;
    input: string;
    output: string;
    raw?: (options: any) => any;
    dev?: {
        port?: number | string;
    };
}
export declare function createProjectConfig(projectConfig: ProjectConfig): ProjectConfig;
