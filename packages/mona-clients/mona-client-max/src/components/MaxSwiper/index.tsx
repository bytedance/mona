import ReactMax, { Component } from '@bytedance/mona-speedy-runtime';

type IProps = Partial<{
  indicatorDots: ReactMax.XSwiperProps['indicator-dots'];
  indicatorColor: ReactMax.XSwiperProps['indicator-color'];
  indicatorActiveColor: ReactMax.XSwiperProps['indicator-active-color'];
  autoplay: ReactMax.XSwiperProps['autoplay'];
  current: ReactMax.XSwiperProps['current'];
  interval: ReactMax.XSwiperProps['interval'];
  duration: ReactMax.XSwiperProps['duration'];
  circular: ReactMax.XSwiperProps['circular'];
  vertical: boolean;
  previousMargin: string;
  nextMargin: string;
  disableTouch: boolean;
  pageMargin: string;
  bindchange: ReactMax.XSwiperProps['bindchange'];
  bindtransition: ReactMax.XSwiperProps['bindtransition'];
  bindscrollstart: (e: any) => void;
  bindscrollend: (e: any) => void;
  customClass?: string;
  customStyle?: ReactMax.CSSProperties | string;
}>;

const dynamicUrl = `https://lf-webcast-sourcecdn-tos.bytegecko.com/obj/byte-gurd-source/10181/gecko/resource/ecommerce_shop_isv_component/swiper${__IS_LYNX3 ? '_rs' : ''}/template.js`
export default class MaxSwiper extends Component<IProps> {
  render() {
    const {
      children,
      customStyle,
      customClass,
      indicatorDots = false,
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
      disableTouch,
    } = this.props;

    const useDynamic = lynx.__globalProps?.queryItems?.feature_mix_use_dynamic === '1';

    return useDynamic ? (
      <component
        customClass={customClass}
        customStyle={customStyle}
        indicatorDots={indicatorDots}
        indicatorColor={indicatorColor}
        indicatorActiveColor={indicatorActiveColor}
        autoplay={autoplay}
        current={current}
        interval={interval}
        duration={duration}
        circular={circular}
        vertical={vertical}
        previousMargin={previousMargin}
        nextMargin={nextMargin}
        pageMargin={pageMargin}
        disableTouch={disableTouch}
        bindchange={this.props.bindchange}
        bindtransition={this.props.bindtransition}
        bindscrollstart={this.props.bindscrollstart}
        bindscrollend={this.props.bindscrollend}
        is={dynamicUrl}
      >
        {children}
      </component>
    ) : (
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
        bindchange={this.props.bindchange}
        bindtransition={this.props.bindtransition}
        bindscrollstart={this.props.bindscrollstart}
        bindscrollend={this.props.bindscrollend}
      >
        {children}
      </swiper>
    );
  }
}
