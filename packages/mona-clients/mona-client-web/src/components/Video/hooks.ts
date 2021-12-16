import { VideoProps } from '@bytedance/mona';
import { useEffect, useRef } from 'react';
import Player from 'xgplayer/dist/core_player';
import play from 'xgplayer/dist/controls/play';
import fullscreen from 'xgplayer/dist/controls/fullscreen';
import progress from 'xgplayer/dist/controls/progress';
// import volume from 'xgplayer/dist/controls/volume';
// import pip from 'xgplayer/dist/controls/pip';
// import flex from 'xgplayer/dist/controls/flex';

export const usePlayer = ({ src = '', autoplay = false, loop = false, poster, showPlayBtn = false, showFullscreenBtn = false }: Partial<VideoProps>) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
   if (videoRef.current) {
     const controlPlugins = [progress];
     if (showPlayBtn) {
       controlPlugins.push(play)
     }
     if (showFullscreenBtn) {
       controlPlugins.push(fullscreen)
     }
      (videoRef.current as any)._player = new Player({
        el: videoRef.current,
        poster: '',
        url: src,
        width: '100%',
        height: '100%',
        controlPlugins
      });
   }
  }, [videoRef.current])


  useEffect(() => {
    const player = (videoRef.current as any)._player;
    if (player) {
      player.src = src;
      player.poster = poster;
      player.autoplay = autoplay;
      player.loop = loop;
    }
  }, [videoRef.current, loop, autoplay, src, poster]);

  return {
    videoRef,
  }
}