import { BaseApis } from '@bytedance/mona'
import formatPath from '../utils/formatPath';
class WebApis extends BaseApis {
  showToast(params: any) {
    window.alert(params.title);
    return Promise.resolve();
  }
  navigateTo(params: any) {
    const url = typeof params === 'string' ? params : params.url;
    history.pushState({}, '', formatPath(url));
    return Promise.resolve();
  }
  redirectTo(params: any) {
    const url = typeof params === 'string' ? params : params.url;
    window.location.href = formatPath(url);
    return Promise.resolve();
  }
  open(params: any) {
    const url = typeof params === 'string' ? params : params.url;
    window.open(formatPath(url));
    return Promise.resolve();
  }
}

export default WebApis