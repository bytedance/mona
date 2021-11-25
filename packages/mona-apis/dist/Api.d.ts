declare abstract class Api {
    abstract showToast(params: {
        title: string;
        icon: 'success' | 'loading' | 'none' | 'fail';
        duration: number;
    }): Promise<any>;
}
export default Api;
