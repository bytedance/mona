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
  binderror: ReactLynx.ImageProps['binderror'];
  bindload: ReactLynx.ImageProps['bindload'];
  bindtap: ReactLynx.ImageProps['bindtap'];
  customClass?: string;
  customStyle?: ReactLynx.CSSProperties | string;
}>;

const dynamicUrl = `https://lf-webcast-sourcecdn-tos.bytegecko.com/obj/byte-gurd-source/10181/gecko/resource/ecommerce_shop_isv_component/image${__IS_LYNX3 ? '_rs' : ''}/template.js`

export default class MaxImage extends Component<IProps> {
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
      bindtap,
      binderror,
      bindload,
    } = this.props;

    const useDynamic = lynx.__globalProps?.queryItems?.feature_mix_use_dynamic === '1';

    return src ? (
      useDynamic ? (
        <component
          customStyle={customStyle}
          customClass={customClass}
          src={src}
          mode={mode}
          placeholder={placeholder}
          blurRadius={blurRadius}
          imageConfig={imageConfig}
          capInsets={capInsets}
          loopCount={loopCount}
          prefetchWidth={prefetchWidth}
          prefetchHeight={prefetchHeight}
          binderror={binderror}
          bindtap={bindtap}
          bindload={bindload}
          is={dynamicUrl}
        />
      ) : (
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
          downsampling
          implicit-animation
          clip-radius
          bindtap={bindtap}
        />
      )
    ) : null;
  }
}
