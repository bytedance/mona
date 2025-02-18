import ReactLynx, { Component } from '@bytedance/mona-speedy-runtime';

type IProps = Partial<{
  canvasId: string;
  customClass?: string;
  customStyle?: ReactLynx.CSSProperties | string;
}>;

const dynamicUrl = `https://lf-webcast-sourcecdn-tos.bytegecko.com/obj/byte-gurd-source/10181/gecko/resource/ecommerce_shop_isv_component/canvas${__IS_LYNX3 ? '_rs' : ''}/template.js`

export default class MaxCanvas extends Component<IProps> {
  render() {
    const { canvasId, customStyle, customClass, bindtap } = this.props;

    const useDynamic = lynx.__globalProps?.queryItems?.feature_mix_use_dynamic === '1';

    return useDynamic ? (
      <component
        canvasId={canvasId}
        customStyle={customStyle}
        customClass={customClass}
        bindtap={bindtap}
        is={dynamicUrl}
      />
    ) : (
      // @ts-ignore
      <canvas
        canvas-id={canvasId}
        // @ts-ignore
        name={canvasId}
        style={customStyle}
        class={customClass}
        bindtap={bindtap}
      />
    );
  }
}
