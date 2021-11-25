import Api from './Api';
export declare const BaseApi: typeof Api;
export declare const showToast: (params: {
    title: string;
    icon: "success" | "loading" | "none" | "fail";
    duration: number;
}) => Promise<any>;
