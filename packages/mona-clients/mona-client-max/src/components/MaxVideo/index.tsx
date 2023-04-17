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
  bindrelease: (e: any) => void;
  bindseek: ReactMax.XVideoProps['bindseek'];
  bindtap: ReactMax.XVideoProps['bindtap'];
  customClass?: string;
  customStyle?: ReactMax.CSSProperties | string;
}>;
export default class ShopVideo extends Component<IProps> {
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
    } = this.props;

    const useDynamic = lynx.__globalProps?.queryItems?.feature_mix_use_dynamic === '1';

    return useDynamic ? (
      <component
        customClass={customClass}
        customStyle={customStyle}
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
        preloadKey={preloadKey}
        __control={__control}
        bindplay={this.props.bindplay}
        bindpause={this.props.bindpause}
        bindended={this.props.bindended}
        bindtimeupdate={this.props.bindtimeupdate}
        bindfullscreenchange={this.props.bindfullscreenchange}
        bindfirstframe={this.props.bindfirstframe}
        bindvideoinfos={this.props.bindvideoinfos}
        binderror={this.props.binderror}
        bindbufferingchange={this.props.bindbufferingchange}
        bindready={this.props.bindready}
        bindseek={this.props.bindseek}
        bindtap={this.props.bindtap}
        bindrelease={this.props.bindrelease}
        is="https://lf-webcast-sourcecdn-tos.bytegecko.com/obj/byte-gurd-source/10181/gecko/resource/ecommerce_shop_isv_component/video/template.js"
      />
    ) : (
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
        bindplay={this.props.bindplay}
        bindpause={this.props.bindpause}
        bindended={this.props.bindended}
        bindtimeupdate={this.props.bindtimeupdate}
        bindfullscreenchange={this.props.bindfullscreenchange}
        bindfirstframe={this.props.bindfirstframe}
        bindvideoinfos={this.props.bindvideoinfos}
        binderror={this.props.binderror}
        bindbufferingchange={this.props.bindbufferingchange}
        bindready={this.props.bindready}
        bindseek={this.props.bindseek}
        bindtap={this.props.bindtap}
        bindrelease={this.props.bindrelease}
      />
    );
  }
}
