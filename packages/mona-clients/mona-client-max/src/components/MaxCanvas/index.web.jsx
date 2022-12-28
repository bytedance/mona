import React, { Component } from "react";

export default class MaxCanvas extends Component {
  render() {
    const {
      canvasId,
      customStyle,
      customClass,
      bindtap
    } = this.props;

    return (
      // @ts-ignore
      <canvas data-canvas-id={canvasId} className={customClass} style={customStyle}></canvas>
    );
  }
}
