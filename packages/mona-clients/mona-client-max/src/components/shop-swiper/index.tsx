import { Component } from '@byted-lynx/react-runtime';

type IProps = Partial<{
  indicatorDots: ReactLynx.XSwiperProps['indicator-dots'];
  indicatorColor: ReactLynx.XSwiperProps['indicator-color'];
  indicatorActiveColor: ReactLynx.XSwiperProps['indicator-active-color'];
  autoplay: ReactLynx.XSwiperProps['autoplay'];
  current: ReactLynx.XSwiperProps['current'];
  interval: ReactLynx.XSwiperProps['interval'];
  duration: ReactLynx.XSwiperProps['duration'];
  circular: ReactLynx.XSwiperProps['circular'];
  vertical: boolean;
  previousMargin: string;
  nextMargin: string;
  disableTouch: boolean;
  pageMargin: string;
  bindchange: ReactLynx.XSwiperProps['bindchange'];
  bindtransition: ReactLynx.XSwiperProps['bindtransition'];
  bindscrollstart: (e: any) => void;
  bindscrollend: (e: any) => void;
  customClass?: string;
  customStyle?: ReactLynx.CSSProperties | string;
}>

export default class ShopSwiper extends Component<IProps> {
  onChange = (e: any) => {
    this.props.bindchange && this.props.bindchange(e);
  };

  onTransition = (e: any) => {
    this.props.bindtransition && this.props.bindtransition(e);
  };

  onScrollStart = (e: any) => {
    this.props.bindscrollstart && this.props.bindscrollstart(e);
  };

  onScrollEnd = (e: any) => {
    this.props.bindscrollend && this.props.bindscrollend(e);
  };

  render() {
    const {
      children,
      customStyle,
      customClass,
      indicatorDots,
      indicatorColor,
      indicatorActiveColor,
      autoplay,
      current,
      interval,
      duration,
      circular,
      vertical,
      previousMargin,
      nextMargin,
      pageMargin,
      disableTouch
    } = this.props;
    return (
      <swiper
        id="swiper"
        class={customClass}
        style={customStyle}
        indicator-dots={indicatorDots}
        indicator-color={indicatorColor}
        indicator-active-color={indicatorActiveColor}
        autoplay={autoplay}
        current={current}
        interval={interval}
        duration={duration}
        circular={circular}
        vertical={vertical}
        previous-margin={previousMargin}
        next-margin={nextMargin}
        page-margin={pageMargin}
        touchable={!disableTouch}
        bindchange={this.onChange}
        bindtransition={this.onTransition}
        bindscrollstart={this.onScrollStart}
        bindscrollend={this.onScrollEnd}
      >
        {children}
      </swiper>
    );
  }
}
