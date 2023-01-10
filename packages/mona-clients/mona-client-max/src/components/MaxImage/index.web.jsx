import { Image } from "@bytedance/mona-speedy-components";
import React, { Component } from "react";
export default class MaxImage extends Component {
  state = {
    hasError: false,
    loaded: false
  };
  onImageError = e => {
    this.setState({
      hasError: true,
      loaded: true
    });
    this.props.binderror && this.props.binderror(e);
  };
  onImageLoad = () => {
    this.setState({
      loaded: true
    });
  };

  render() {
    const {
      src,
      mode,
      placeholder,
      blurRadius,
      imageConfig,
      capInsets,
      loopCount,
      prefetchWidth,
      prefetchHeight,
      customStyle,
      customClass,
      bindtap
    } = this.props;
    const {
      hasError
    } = this.state;
    return src && !hasError ? /*#__PURE__*/React.createElement(Image, {
      style: customStyle,
      class: customClass,
      src: src,
      mode: mode,
      placeholder: placeholder,
      "blur-radius": blurRadius,
      "image-config": imageConfig,
      "cap-insets": capInsets,
      "loop-count": loopCount,
      "prefetch-width": prefetchWidth,
      "prefetch-height": prefetchHeight,
      "skip-redirection": true,
      downsampling: true,
      "implicit-animation": true,
      "clip-radius": true,
      binderror: this.onImageError,
      bindload: this.onImageLoad,
      bindtap: bindtap
    }) : null;
  }

}