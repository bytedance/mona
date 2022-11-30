import { Component } from '@byted-lynx/react-runtime';

type IProps = Partial<{
  src: ReactLynx.XVideoProps['src'];
  autoplay: ReactLynx.XVideoProps['autoplay'];
  inittime: ReactLynx.XVideoProps['inittime'];
  loop: ReactLynx.XVideoProps['loop'];
  muted: ReactLynx.XVideoProps['muted'];
  rate: ReactLynx.XVideoProps['rate'];
  autolifecycle: ReactLynx.XVideoProps['autolifecycle'];
  poster: ReactLynx.XVideoProps['poster'];
  objectfit: ReactLynx.XVideoProps['objectfit'];
  cache: boolean;
  preloadKey: string;
  __control: string;
  volume: ReactLynx.XVideoProps['volume'];
  bindplay: ReactLynx.XVideoProps['bindplay'];
  bindpause: ReactLynx.XVideoProps['bindpause'];
  bindended: ReactLynx.XVideoProps['bindended'];
  bindtimeupdate: ReactLynx.XVideoProps['bindtimeupdate'];
  bindfullscreenchange: ReactLynx.XVideoProps['bindfullscreenchange'];
  bindfirstframe: (e: any) => void;
  bindvideoinfos: (e: any) => void;
  binderror: ReactLynx.XVideoProps['binderror'];
  bindbufferingchange: ReactLynx.XVideoProps['bindbufferingchange'];
  bindready: (e: any) => void;
  bindseek: ReactLynx.XVideoProps['bindseek'];
  customClass?: string;
  customStyle?: ReactLynx.CSSProperties | string;
}>;

type IState = {
  hasError: boolean;
}

export default class ShopVideo extends Component<IProps, IState> {
  state = {
    hasError: false
  }

  onPlay = e => {
    this.props.bindplay && this.props.bindplay(e);
  }
  onPause = e => {
    this.props.bindpause && this.props.bindpause(e);
  }
  onEnded = e => {
    this.props.bindended && this.props.bindended(e);
  }
  onFirstFrame = e => {
    this.props.bindfirstframe && this.props.bindfirstframe(e);
  }
  onVideoInfos= e => {
    this.props.bindvideoinfos && this.props.bindvideoinfos(e);
  }
  onError = e => {
    this.setState({ hasError: true });
    this.props.binderror && this.props.binderror(e);
  }
  onTimeUpdate = e => {
    this.props.bindtimeupdate && this.props.bindtimeupdate(e);
  }
  onFullScreenChange = e => {
    this.props.bindfullscreenchange && this.props.bindfullscreenchange(e);
  }
  onBufferingChange = e => {
    this.props.bindbufferingchange && this.props.bindbufferingchange(e);
  }
  onReady= e => {
    this.props.bindready && this.props.bindready(e);
  }
  onSeek = e => {
    this.props.bindseek && this.props.bindseek(e);
  }

  render() {
    const {
      customStyle,
      customClass,
      src,
      autoplay,
      inittime,
      loop,
      muted,
      rate,
      autolifecycle,
      poster,
      objectfit,
      cache,
      preloadKey,
      __control,
      volume
    } = this.props;
    return (
      <x-video-pro
        id="video"
        class={customClass}
        style={customStyle}
        src={src}
        autoplay={autoplay}
        inittime={inittime}
        loop={loop}
        muted={muted}
        rate={rate}
        autolifecycle={autolifecycle}
        poster={poster}
        objectfit={objectfit}
        cache={cache}
        preload-key={preloadKey}
        __control={__control}
        volume={volume}
        bindplay={this.onPlay}
        bindpause={this.onPause}
        bindended={this.onEnded}
        bindtimeupdate={this.onTimeUpdate}
        bindfullscreenchange={this.onFullScreenChange}
        bindfirstframe={this.onFirstFrame}
        bindvideoinfos={this.onVideoInfos}
        binderror={this.onError}
        bindbufferingchange={this.onBufferingChange}
        bindready={this.onReady}
        bindseek={this.onSeek}
      />
    );
  }
}
