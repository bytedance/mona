export declare type TemplateType = 'pc' | 'mobile' | 'plugin' | 'monorepo';
export interface Answer {
    projectName: string;
    templateType: TemplateType;
    useTypescript: boolean;
    styleProcessor: 'less' | 'css';
}
export interface AskOpts {
    projectName: string;
    templateType: TemplateType;
    useTypescript: boolean;
    styleProcessor: Answer['styleProcessor'];
}
export declare function ask(opts: AskOpts): Promise<AskOpts & Answer>;
