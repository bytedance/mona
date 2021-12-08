import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ShowModalOptions, CommonErrorArgs } from '@bytedance/mona';
import { Masking } from '../Masking/index'
import { hide } from '../util'
import './index.css';

const MONA_WEB_MODAL = 'mona-web-modal';

export function Modal(props: ShowModalOptions): JSX.Element {
  const btnConfirm = useCallback(
    ({
      confirm = false,
      cancel = false,
      errMsg = '',
    }: { confirm?: boolean; cancel?: boolean } & Partial<CommonErrorArgs>) => {
      hide(MONA_WEB_MODAL)
      props.success?.({ confirm, cancel, errMsg });
      props.complete?.({ confirm, cancel, errMsg });
    },
    []
  );

  return (
    <>
      <div className="mona-web-modal-body">
        {props.title && (
          <div className="mona-web-modal-title">{props.title}</div>
        )}
        <div
          className={`mona-web-modal-content ${
            props.content ? 'mona-web-modal-has-border' : ''
          }`}
        >
          {props.content}
        </div>
        <div className="mona-web-modal-footer">
          <div
            className="mona-web-modal-button"
            onClick={() => btnConfirm({ cancel: true })}
          >
            {props.confirmText || '取消'}
          </div>
          <div
            className="mona-web-modal-button"
            onClick={() =>
              btnConfirm({ confirm: true })
            }
          >
            {props.cancelText || '确认'}
          </div>
        </div>
      </div>
      <Masking onHandle={() => hide(MONA_WEB_MODAL)} />
    </>
  );
}

function confirm(props: ShowModalOptions) {
  const container = document.createElement('div');
  container.id = MONA_WEB_MODAL;
  function render() {
    document.body.append(container);
    setTimeout(() => {
      ReactDOM.render(<Modal {...props} />, container);
    });
  }

  render();
}

export function webShowModal(props: ShowModalOptions) {
  confirm(props);
}
