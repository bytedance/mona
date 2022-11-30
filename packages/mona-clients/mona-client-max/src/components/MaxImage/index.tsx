import ReactLynx, { Component } from '@bytedance/mona-speedy-runtime';

type IProps = Partial<{
  src: ReactLynx.ImageProps['src'];
  mode: ReactLynx.ImageProps['mode'];
  placeholder: ReactLynx.ImageProps['placeholder'];
  blurRadius: ReactLynx.ImageProps['blur-radius'];
  imageConfig: ReactLynx.ImageProps['image-config'];
  capInsets: ReactLynx.ImageProps['cap-insets'];
  loopCount: ReactLynx.ImageProps['loop-count'];
  prefetchWidth: ReactLynx.ImageProps['prefetch-width'];
  prefetchHeight: ReactLynx.ImageProps['prefetch-height'];
  skipRedirection: ReactLynx.ImageProps['skip-redirection'];
  imageTransitionStyle: 'fadeIn' | 'none';
  preventLoadingOnListScroll: boolean;
  binderror: ReactLynx.ImageProps['binderror'];
  customClass?: string;
  customStyle?: ReactLynx.CSSProperties | string;
}>;

type IState = {
  hasError: boolean;
  loaded: boolean;
};

export default class MaxImage extends Component<IProps, IState> {
  state = {
    hasError: false,
    loaded: false
  };

  onImageError = (e: any) => {
    this.setState({ hasError: true, loaded: true });
    this.props.binderror && this.props.binderror(e);
  };

  onImageLoad = () => {
    this.setState({ loaded: true });
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
      imageTransitionStyle,
      preventLoadingOnListScroll,
      customStyle,
      customClass
    } = this.props;

    const { hasError } = this.state;

    return src && !hasError ? (
      <image
        style={customStyle}
        class={customClass}
        src={src}
        mode={mode}
        placeholder={placeholder}
        blur-radius={blurRadius}
        image-config={imageConfig}
        cap-insets={capInsets}
        loop-count={loopCount}
        prefetch-width={prefetchWidth}
        prefetch-height={prefetchHeight}
        skip-redirection
        image-transition-style={imageTransitionStyle}
        prevent-loading-on-list-scroll={preventLoadingOnListScroll}
        downsampling
        implicit-animation
        clip-radius
        binderror={this.onImageError}
        bindload={this.onImageLoad}
      />
    ) : null;
  }
}
