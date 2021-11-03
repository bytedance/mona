export declare type TemplateType = 'pc' | 'mobile' | 'plugin' | 'monorepo';
export interface Answer {
    projectName: string;
    templateType: TemplateType;
    useTypescript: boolean;
    styleProcessor: 'less' | 'css';
}
interface AskOpts {
    projectName?: string;
    templateType?: string;
    useTypescript?: boolean;
    styleProcessor?: string;
}
export declare function ask(opts: AskOpts): Promise<AskOpts & Answer>;
export {};
