declare const showToast: (params: {
    title: string;
    icon: "success" | "loading" | "none" | "fail";
    duration: number;
}) => Promise<any>;
export { showToast };
