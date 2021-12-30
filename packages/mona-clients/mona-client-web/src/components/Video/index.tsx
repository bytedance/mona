import React from 'react';
import { VideoProps } from '@bytedance/mona';
// import Mp4Player from 'xgplayer-mp4';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { usePlayer } from './hooks';
// import NotImplemented from '../NotImplemented';

// TODO: implement with xgplayer
// https://v2.h5player.bytedance.com/
const Video: React.FC<VideoProps> = props => {
  const {
    children,
    src,
    autoplay = false,
    poster,
    loop = false,
    showFullscreenBtn = true,
    showPlayBtn = true,
    controls = true,
    objectFit = 'contain',
    playBtnPosition = 'center',
    preRollUnitId,
    postRollUnitId,
    vslideGesture = false,
    vslideGestureInFullscreen = true,
    enableProgressGesture = false,
    enablePlayGesture = false,
    muted = false,
    showMuteBtn = false,
    showPlaybackRateBtn = false,
    direction = -90,
    enablePlayInBackground = false,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate,
    onFullscreenChange,
    onWaiting,
    onAdStart,
    onAdEnded,
    onAdLoad,
    onAdClose,
    onAdError,
    onLoadedMetaData,
    onSeekComplete,
    onPlayBackRateChange,
    onMuteChange,
    onControlTap,
    onEnterBackground,
    onCloseBackground,
    onLeaveBackground,
    ...restProps
  } = props;

  const { handleClassName, ...handlerProps } = useHandlers(restProps);

  const { videoRef, ObjectFitClass } = usePlayer(props);

  return (
    <div className={handleClassName([ObjectFitClass, styles.video])} {...handlerProps}>
      <div ref={videoRef}></div>
    </div>
  );
};

export default Video;

Video.defaultProps = {
  autoplay: false,
  loop: false,
  showFullscreenBtn: true,
  controls: true,
  objectFit: 'contain',
  playBtnPosition: 'center',
  vslideGesture: false,
  vslideGestureInFullscreen: true,
  enableProgressGesture: false,
  enablePlayGesture: false,
  muted: false,
  showMuteBtn: false,
  showPlaybackRateBtn: false,
  direction: -90,
  enablePlayInBackground: false,
};
