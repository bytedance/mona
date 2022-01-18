import { VideoProps } from '@bytedance/mona';
import { useEffect, useRef, useState } from 'react';
import Player from 'xgplayer';
import 'xgplayer-mp4';
import styles from './index.module.less';

// import play from 'xgplayer/dist/controls/play';
// import fullscreen from 'xgplayer/dist/controls/fullscreen';
// import progress from 'xgplayer/dist/controls/progress';
// import volume from 'xgplayer/dist/controls/volume';
// import pip from 'xgplayer/dist/controls/pip';
// import flex from 'xgplayer/dist/controls/flex';
const buttonIgnores = {
  fullscreen: 'fullscreen',
  play: 'play',
};

const getStyle = {
  contain: styles.videoContain,
  fill: styles.videoFill,
  cover: styles.videoCover,
};

export const usePlayer = ({
  src,
  autoplay = false,
  poster,
  loop = false,
  showFullscreenBtn = true,
  showPlayBtn = true,
  controls = true,
  objectFit = 'contain',
  direction = -90,
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate,
  onFullscreenChange,
  onWaiting,

  onSeekComplete,
}: Partial<VideoProps>) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const [player, setPlayer] = useState<Player>();
  useEffect(() => {
    if (videoRef.current) {
      // const controlPlugins = [progress];
      // if (showPlayBtn) {
      //   controlPlugins.push(play);
      // }
      // if (showFullscreenBtn) {
      //   controlPlugins.push(fullscreen);
      // }
      buttonIgnores.fullscreen = showFullscreenBtn ? '' : buttonIgnores.fullscreen;
      buttonIgnores.play = showPlayBtn ? '' : buttonIgnores.play;
      setPlayer(
        new Player({
          el: videoRef.current,
          url: src ?? '',
          poster,
          width: '100%',
          height: '100%',
          // controlsList: ['nodownload', 'nofullscreen', 'noremoteplayback'],
          //@ts-ignore
          ignores: ['volume', ...Object.values(buttonIgnores).filter(item => item)],
          // controlPlugins,
          controls: controls,
          // videoStyle: {
          //   transform: 'rotate(90deg)',
          // },
          rotate: { innerRotate: true },
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (player) {
      player.src = src || '';
      player.autoplay = autoplay;
      player.loop = loop;
      // player.controls = controls;
    }
  }, [player, loop, autoplay, src]);

  const rotateRef = useRef(direction);
  const completeRef = useRef(false);

  useEffect(() => {
    const cb = () => {
      completeRef.current = true;
      if (rotateRef.current === 90) {
        setTimeout(() => {
          player?.rotate(true, true, 1);
        }, 100);
        rotateRef.current = 90;
      } else if (rotateRef.current === -90) {
        setTimeout(() => {
          player?.rotate(false, true, 1);
        }, 100);
        rotateRef.current = -90;
      } else {
        rotateRef.current = 0;
      }
    };
    player?.once('complete', cb);
    return () => {
      player?.off('complete', cb);
    };
  }, [player]);
  useEffect(() => {
    if (!player || !completeRef.current) return;
    const currRotate = rotateRef.current;
    let times = currRotate / 90;
    if (Math.floor(times) > 0) {
      player.rotate(false, true, times);
    } else if (Math.floor(times) < 0) {
      player.rotate(true, true, times);
    }

    if (direction === 90) {
      player.rotate(true, true);
      rotateRef.current = 90;
    } else if (direction === -90) {
      player.rotate(false, true, 1);
      rotateRef.current = -90;
    } else {
      rotateRef.current = 0;
    }
  }, [player, direction]);
  useEffect(() => {
    const addListener = (name: string, cb: any) => {
      typeof cb === 'function' && player?.on(name, cb);
    };
    const removeListener = (name: string, cb: any) => {
      typeof cb === 'function' && player?.off(name, cb);
    };
    if (player) {
      addListener('play', onPlay);
      addListener('playing', onPlay);
      addListener('pause', onPause);
      addListener('ended', onEnded);
      addListener('error', onError);
      addListener('timeupdate', onTimeUpdate);
      addListener('requestFullscreen', onFullscreenChange);
      addListener('waiting', onWaiting);
      addListener('seeked', onSeekComplete);
    }

    () => {
      if (player) {
        removeListener('play', onPlay);
        removeListener('playing', onPlay);
        removeListener('pause', onPause);
        removeListener('ended', onEnded);
        removeListener('error', onError);
        removeListener('timeupdate', onTimeUpdate);
        removeListener('requestFullscreen', onFullscreenChange);
        removeListener('waiting', onWaiting);
        removeListener('seeked', onSeekComplete);
      }
    };
  }, [player, onSeekComplete, onWaiting, onFullscreenChange, onTimeUpdate, onError, onEnded, onPause, onPlay]);
  return {
    videoRef,
    ObjectFitClass: getStyle[objectFit],
  };
};
