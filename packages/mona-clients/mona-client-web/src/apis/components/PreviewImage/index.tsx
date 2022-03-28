import React, { FC, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { PreviewImageOptions } from '@bytedance/mona';
import { Masking } from '../Masking';
import { hide } from '../util';
import './index.module.less';

const MONA_WEB_PREVIEW_IMAGE = 'mona-web-preview-image';

export const PreviewImage: FC<PreviewImageOptions> = ({ urls, current, success, complete }) => {
  const [pos, setPos] = useState(0);
  const [src, setSrc] = useState(urls?.[0]);

  useEffect(() => {
    if (current) {
      const idx = urls.indexOf(current);
      setPos(idx === -1 ? 0 : idx);
      setSrc(current);
    }
  }, [current]);

  const changeImage = useCallback(
    (offset: number) => {
      let currentPos = pos + offset;
      if (currentPos >= urls.length) {
        currentPos = 0;
      }

      if (currentPos < 0) {
        currentPos = urls.length - 1;
      }
      setPos(currentPos);
      setSrc(urls[currentPos]);
      success?.({ errMsg: 'previewImage:ok' });
      complete?.({ errMsg: 'previewImage:ok' });
    },
    [src, pos]
  );

  return (
    <>
      <img
        className="mona-web-preview-image-close"
        src={
          'https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/fb4f01d26afde666b1f0e18611c1322e.png~tplv-w59vco1lho-png.png'
        }
        onClick={() => hide(MONA_WEB_PREVIEW_IMAGE)}
      />
      {src && (
        <>
          <img
            className="mona-web-preview-image-arrow-left"
            onClick={() => changeImage(-1)}
            src="https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/25eabf0482d9f65bfa3e0382b48ec262.png~tplv-w59vco1lho-png.png"
          />
          <img
            className="mona-web-preview-image-arrow-right"
            onClick={() => changeImage(1)}
            src="https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/25eabf0482d9f65bfa3e0382b48ec262.png~tplv-w59vco1lho-png.png"
          />
          <img className="mona-web-preview-image" src={src} />
        </>
      )}

      <Masking onHandle={() => {}} className="mona-web-preview-image-mask" />
    </>
  );
};

function confirm(props: PreviewImageOptions) {
  const container = document.createElement('div');
  container.id = MONA_WEB_PREVIEW_IMAGE;
  document.body.append(container);
  setTimeout(() => {
    ReactDOM.render(<PreviewImage {...props} />, container);
  });
}

export function showPreviewImage(props: PreviewImageOptions) {
  const errMsg = { errMsg: 'previewImage:fail' };
  try {
    confirm(props);
    props.success?.({ errMsg: 'previewImage:ok' });
    props.complete?.({ errMsg: 'previewImage:ok' });
  } catch (e) {
    props.fail?.(errMsg);
    props.complete?.(errMsg);
  }
}
