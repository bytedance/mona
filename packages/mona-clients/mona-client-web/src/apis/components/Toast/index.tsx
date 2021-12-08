import React from 'react'
import ReactDOM from 'react-dom';
import { ShowToastOptions } from '@bytedance/mona'
import './index.module.less';
import { getToastIconConfig, ToastType } from './util';
import { hide } from '../util'

export * from './util';

const MONA_WEB_TOAST = 'mona-web-toast';

export const webHideToast = () => hide(MONA_WEB_TOAST)

export function Toast({ title, icon = 'success' }: ShowToastOptions): JSX.Element {
  const { url, className } = getToastIconConfig(icon);
  return (
    <div className="mona-web-toast-body">
      {url && (
        <img
          className={`mona-web-toast-${className}-img`}
          src={url}
          alt={className}
        />
      )}
      <span className="mona-web-toast-text">{title}</span>
    </div>
  );
}

export function Toastconfirm(config: ShowToastOptions, popType: ToastType) {
  const container = document.createElement('div');
  container.id = MONA_WEB_TOAST;

  if (popType === ToastType.loading) {
    config.icon = 'loading';
  }

  const successCallbackText = { errMsg: 'showToast:ok' };
  const errorCallbackText = { errMsg: `showToast:fail params.title should be string, but got ${typeof config.title} ` }

  function render() {
    let timer = null;
    try {
      webHideToast();

      if (timer) {
        timer = null;
      }
      document.body.append(container);
      ReactDOM.render(<Toast {...config} />, container);

      if (popType === ToastType.toast) {
        timer = setTimeout(() => {
          webHideToast();
        }, config.duration || 1500);
      }

      config.success?.(successCallbackText);
      config.complete?.(successCallbackText);
    } catch {
      config.fail?.(errorCallbackText);
      config.complete?.(errorCallbackText);
    }
  }

  render();
}

export function webShowToast(config: ShowToastOptions) {
  if (!config.title) {
    config.fail?.({
      errMsg: 'showToast调用失败'
    });
  } else {
    Toastconfirm(config, ToastType.toast);
  }
}
