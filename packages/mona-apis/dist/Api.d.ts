export default abstract class Api {
    showToast: (params: {
        title: string;
        icon: 'success' | 'loading' | 'none' | 'fail';
        duration: number;
    }) => Promise<any>;
}
