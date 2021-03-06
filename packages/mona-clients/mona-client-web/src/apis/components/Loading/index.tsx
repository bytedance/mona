import { ShowToastOptions } from '@bytedance/mona'
import { Toastconfirm, ToastType } from '../Toast';

export function webShowLoading(config: ShowToastOptions) {
  if (!config.title) {
    config.fail?.({errMsg: 'showLoading:fail'});
  } else {
    Toastconfirm(config, ToastType.loading);
  }
}
