import ReactMax, { Component } from '@bytedance/mona-speedy-runtime';

type IProps = Partial<{
  src: ReactMax.XVideoProps['src'];
  autoplay: ReactMax.XVideoProps['autoplay'];
  inittime: ReactMax.XVideoProps['inittime'];
  loop: ReactMax.XVideoProps['loop'];
  muted: boolean;
  rate: ReactMax.XVideoProps['rate'];
  autolifecycle: ReactMax.XVideoProps['autolifecycle'];
  poster: ReactMax.XVideoProps['poster'];
  objectfit: ReactMax.XVideoProps['objectfit'];
  cache: boolean;
  preloadKey: string;
  __control: string;
  // volume: ReactMax.XVideoProps['volume'];
  bindplay: ReactMax.XVideoProps['bindplay'];
  bindpause: ReactMax.XVideoProps['bindpause'];
  bindended: ReactMax.XVideoProps['bindended'];
  bindtimeupdate: ReactMax.XVideoProps['bindtimeupdate'];
  bindfullscreenchange: ReactMax.XVideoProps['bindfullscreenchange'];
  bindfirstframe: (e: any) => void;
  bindvideoinfos: (e: any) => void;
  binderror: ReactMax.XVideoProps['binderror'];
  bindbufferingchange: ReactMax.XVideoProps['bindbufferingchange'];
  bindready: (e: any) => void;
  bindseek: ReactMax.XVideoProps['bindseek'];
  customClass?: string;
  customStyle?: ReactMax.CSSProperties | string;
}>;

type IState = {
  hasError: boolean;
}

export default class ShopVideo extends Component<IProps, IState> {
  state = {
    hasError: false
  }

  onPlay = (e: any) => {
    this.props.bindplay && this.props.bindplay(e);
  }
  onPause = (e: any) => {
    this.props.bindpause && this.props.bindpause(e);
  }
  onEnded = (e: any) => {
    this.props.bindended && this.props.bindended(e);
  }
  onFirstFrame = (e: any) => {
    this.props.bindfirstframe && this.props.bindfirstframe(e);
  }
  onVideoInfos = (e: any) => {
    this.props.bindvideoinfos && this.props.bindvideoinfos(e);
  }
  onError = (e: any) => {
    this.setState({ hasError: true });
    this.props.binderror && this.props.binderror(e);
  }
  onTimeUpdate = (e: any) => {
    this.props.bindtimeupdate && this.props.bindtimeupdate(e);
  }
  onFullScreenChange = (e: any) => {
    this.props.bindfullscreenchange && this.props.bindfullscreenchange(e);
  }
  onBufferingChange = (e: any) => {
    this.props.bindbufferingchange && this.props.bindbufferingchange(e);
  }
  onReady = (e: any) => {
    this.props.bindready && this.props.bindready(e);
  }
  onSeek = (e: any) => {
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
      // volume
      bindtap
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
        // volume={volume}
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
        bindtap={bindtap}
      />
    );
  }
}