import ReactMax, { Component } from '@bytedance/mona-speedy-runtime';


type IProps = Partial<{
  src: ReactMax.XVideoProps['src'];
  autoplay: ReactMax.XVideoProps['autoplay'];
  inittime: ReactMax.XVideoProps['inittime'];
  loop: ReactMax.XVideoProps['loop'];
  muted: ReactMax.XVideoProps['muted'];
  rate: ReactMax.XVideoProps['rate'];
  autolifecycle: ReactMax.XVideoProps['autolifecycle'];
  poster: ReactMax.XVideoProps['poster'];
  objectfit: ReactMax.XVideoProps['objectfit'];
  videowidth: ReactMax.XVideoProps['videowidth'];
  videoheight: ReactMax.XVideoProps['videoheight'];
  devicechangeaware: ReactMax.XVideoProps['devicechangeaware'];
  __control: string;
  volume: ReactMax.XVideoProps['volume'];
  bindplay: ReactMax.XVideoProps['bindplay'];
  bindpause: ReactMax.XVideoProps['bindpause'];
  bindended: ReactMax.XVideoProps['bindended'];
  bindtimeupdate: ReactMax.XVideoProps['bindtimeupdate'];
  bindfullscreenchange: ReactMax.XVideoProps['bindfullscreenchange'];
  binderror: ReactMax.XVideoProps['binderror'];
  bindbufferingchange: ReactMax.XVideoProps['bindbufferingchange'];
  bindseek: ReactMax.XVideoProps['bindseek'];
  binddevicechange: ReactMax.XVideoProps['binddevicechange'];
  customClass?: string;
  customStyle?: ReactMax.CSSProperties | string;
}>

type IState = {
  hasError: boolean;
}

export default class MaxVideo extends Component<IProps, IState> {
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
  onSeek = (e: any) => {
    this.props.bindseek && this.props.bindseek(e);
  }
  onDeviceChange = (e: any) => {
    this.props.binddevicechange && this.props.binddevicechange(e);
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
      devicechangeaware,
      __control,
      videowidth,
      videoheight,
      volume
    } = this.props;
    return (
      <x-video
        id="video"
        class={customClass}
        style={customStyle}
        src={src}
        autoplay={autoplay}
        inittime={inittime}
        loop={loop}
        repeat={loop}
        muted={muted}
        volume={volume}
        rate={rate}
        autolifecycle={autolifecycle}
        poster={poster}
        objectfit={objectfit}
        videowidth={videowidth}
        videoheight={videoheight}
        devicechangeaware={devicechangeaware}
        __control={__control}
        bindplay={this.onPlay}
        bindpause={this.onPause}
        bindended={this.onEnded}
        bindtimeupdate={this.onTimeUpdate}
        bindfullscreenchange={this.onFullScreenChange}
        binderror={this.onError}
        bindbufferingchange={this.onBufferingChange}
        bindseek={this.onSeek}
        binddevicechange={this.onDeviceChange}
      />
    );
  }
}
