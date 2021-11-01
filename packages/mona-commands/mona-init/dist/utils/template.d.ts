export declare const fetchTemplate: (projectRoot: string, templateName: string) => Promise<unknown>;
export declare function processTemplate(filePath: string, templateData: Record<string, any>): Promise<void>;
export declare function processTemplates(dirPath: string, templateData: Record<string, any>): Promise<void>;
export declare function caclProjectType(templateType: 'pc' | 'mobile' | 'plugin' | 'monorepo'): string;
