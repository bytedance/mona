require("@bytedance/mona-speedy-components").useSwiper();

import { Swiper } from "@bytedance/mona-speedy-components";
import React, { Component } from "react";
export default class MaxSwiper extends Component {
  onChange = e => {
    this.props.bindchange && this.props.bindchange(e);
  };
  onTransition = e => {
    this.props.bindtransition && this.props.bindtransition(e);
  };
  onScrollStart = e => {
    this.props.bindscrollstart && this.props.bindscrollstart(e);
  };
  onScrollEnd = e => {
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
    return /*#__PURE__*/React.createElement(Swiper, {
      id: "swiper",
      class: customClass,
      style: customStyle,
      "indicator-dots": indicatorDots,
      "indicator-color": indicatorColor,
      "indicator-active-color": indicatorActiveColor,
      autoplay: autoplay,
      current: current,
      interval: interval,
      duration: duration,
      circular: circular,
      vertical: vertical,
      "previous-margin": previousMargin,
      "next-margin": nextMargin,
      "page-margin": pageMargin,
      touchable: !disableTouch,
      bindchange: this.onChange,
      bindtransition: this.onTransition,
      bindscrollstart: this.onScrollStart,
      bindscrollend: this.onScrollEnd
    }, children);
  }

}