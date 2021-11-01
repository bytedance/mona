export declare type TemplateType = 'pc' | 'mobile' | 'plugin' | 'monorepo';
export interface Answer {
    projectName: string;
    templateType: TemplateType;
    useTypescript: boolean;
    styleProcessor: 'less' | 'scss' | 'css';
}
export declare function ask(): Promise<Answer>;
