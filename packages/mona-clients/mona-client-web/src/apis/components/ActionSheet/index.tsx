import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ActionSheetProps } from '@bytedance/mona';
import { Masking } from '../Masking';
import { hide } from '../util';
import './index.module.less';

export const MONA_WEB_ACTION_SHEET = 'mona-web-action-sheet';

export function ActionSheet(props: ActionSheetProps) {
  const handleItem = useCallback(
    (tapIndex: number) => {
      const errMsg = {
        errMsg: 'showActionSheet:ok',
        tapIndex,
      };
      props?.success?.(errMsg);
      props?.complete?.(errMsg);
      hide(MONA_WEB_ACTION_SHEET);
    },
    [props]
  );
  return (
    <>
      <div className="mona-web-action-sheet-body">
        {props.itemList?.map((item, idx) => (
          <div key={item} onClick={() => handleItem(idx)} className="mona-web-action-sheet-item">
            {item}
          </div>
        ))}
      </div>
      <Masking onHandle={() => hide(MONA_WEB_ACTION_SHEET)} />
    </>
  );
}

function confirm(props: ActionSheetProps) {
  const container = document.createElement('div');
  container.id = MONA_WEB_ACTION_SHEET;

  function render() {
    document.body.append(container);
    ReactDOM.render(<ActionSheet {...props} />, container);
  }

  render();
}

export function webShowActionSheet(options: ActionSheetProps) {
  if (Array.isArray(options?.itemList) && options.itemList) {
    confirm(options);
  } else {
    const errMsg = 'showActionSheet:fail';
    options?.fail?.({ errMsg });
    options?.complete?.({ errMsg });
  }
}
