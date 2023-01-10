import ReactLynx, { Component } from '@bytedance/mona-speedy-runtime';

type IProps = Partial<{
  canvasId: string;
  customClass?: string;
  customStyle?: ReactLynx.CSSProperties | string;
}>;

export default class MaxCanvas extends Component<IProps> {
  render() {
    const {
      canvasId,
      customStyle,
      customClass,
      bindtap
    } = this.props;

    return (
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
