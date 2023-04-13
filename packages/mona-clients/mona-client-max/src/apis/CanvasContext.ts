import { CanvasContext } from '@bytedance/mona';

class CanvasContextImplement implements CanvasContext {
  private _ctx: CanvasRenderingContext2D;
  private _ele: HTMLCanvasElement;
  // private _ctx: CanvasRenderingContext2D;
  // private _offscreentCanvas: HTMLCanvasElement;

  constructor(ele: HTMLCanvasElement | null) {
    if (!ele) {
      throw new Error("the canvas's element is empty!");
    }
    this._ele = ele;
    const ctx = ele.getContext('2d');
    if (!ctx) {
      throw new Error("can't get the context of canvas!");
    }
    this._ctx = ctx;

    // const { context: octx, $canvas } = this.createOffscreenCtx(ele);
    // if (!octx) {
    //   throw new Error("create offscreen canvas failed!")
    // }
    // this._ctx = octx;
    // this._offscreentCanvas = $canvas;
  }

  // private createOffscreenCtx(ele: HTMLCanvasElement) {
  //   const width = ele.offsetWidth;
  //   const height = ele.offsetHeight;

  //   const $canvas = document.createElement('canvas');
  //   $canvas.width = width;
  //   $canvas.height = height;
  //   const context = $canvas.getContext('2d');
  //   return { context, $canvas };
  // }

  draw(reserve?: boolean, callback?: () => void): void {
    if (!reserve) {
      const width = this._ele.width;
      const height = this._ele.height;
      this._ctx.clearRect(0, 0, width, height);
    }
    this._ctx.drawImage(this._ele, 0, 0);
    if (typeof callback === 'function') {
      callback();
    }
  }

  setFontSize(fontSize: number): void {
    this._ctx.font = `${fontSize}px`;
  }

  setFillStyle(color: string): void {
    this._ctx.fillStyle = color;
  }

  setLineCap(lineCap: 'butt' | 'round' | 'square'): void {
    this._ctx.lineCap = lineCap;
  }

  setLineJoin(lineJoin: 'bevel' | 'round' | 'miter'): void {
    this._ctx.lineJoin = lineJoin;
  }

  setLineWidth(lineWidth: number): void {
    this._ctx.lineWidth = lineWidth;
  }

  setMiterLimit(miterLimit: number): void {
    this._ctx.miterLimit = miterLimit;
  }

  setTextBaseline(textBaseline: 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom'): void {
    this._ctx.textBaseline = textBaseline;
  }

  setStrokeStyle(color: string): void {
    this._ctx.strokeStyle = color;
  }

  setGlobalAlpha(alpha: number): void {
    this._ctx.globalAlpha = alpha;
  }

  setTextAlign(align: 'left' | 'center' | 'right'): void {
    this._ctx.textAlign = align;
  }

  setLineDash(pattern: number[], offset: number): void {
    this._ctx.setLineDash(pattern);
    this._ctx.lineDashOffset = offset;
  }

  createLinearGradient(sx: number, sy: number, dx: number, dy: number): CanvasGradient {
    return this._ctx.createLinearGradient(sx, sy, dx, dy);
  }

  setTransform(
    scaleX: number,
    skewX: number,
    skewY: number,
    scaleY: number,
    translateX: number,
    translateY: number,
  ): void {
    return this._ctx.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);
  }

  beginPath(): void {
    return this._ctx.beginPath();
  }

  clip(): void {
    return this._ctx.clip();
  }

  lineTo(x: number, y: number): void {
    return this._ctx.lineTo(x, y);
  }

  transform(
    scaleX: number,
    skewX: number,
    skewY: number,
    scaleY: number,
    translateX: number,
    translateY: number,
  ): void {
    return this._ctx.transform(scaleX, skewX, skewY, scaleY, translateX, translateY);
  }

  fill(): void {
    return this._ctx.fill();
  }

  stroke(): void {
    return this._ctx.stroke();
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    return this._ctx.fillRect(x, y, width, height);
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    return this._ctx.strokeRect(x, y, width, height);
  }

  drawImage(
    imageResource: string,
    sx: number,
    sy: number,
    sw?: number,
    sh?: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number,
  ): void {
    // TODO
    const $image = document.createElement('img');
    $image.src = imageResource;
    return this._ctx.drawImage($image, sx, sy, sw || 0, sh || 0, dx || 0, dy || 0, dw || 0, dh || 0);
  }

  measureText(text: string): { width: number } {
    return this._ctx.measureText(text);
  }

  scale(scaleWidth: number, scaleHeight: number): void {
    return this._ctx.scale(scaleWidth, scaleHeight);
  }

  rotate(rotate: number): void {
    return this._ctx.rotate(rotate);
  }

  translate(x: number, y: number): void {
    return this._ctx.translate(x, y);
  }

  save(): void {
    return this._ctx.save();
  }

  restore(): void {
    return this._ctx.restore();
  }

  clearRect(x: number, y: number, width: number, height: number): void {
    return this._ctx.clearRect(x, y, width, height);
  }

  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    return this._ctx.fillText(text, x, y, maxWidth);
  }

  moveTo(x: number, y: number): void {
    return this._ctx.moveTo(x, y);
  }

  rect(x: number, y: number, width: number, height: number): void {
    return this._ctx.rect(x, y, width, height);
  }

  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, anticlockwise: boolean): void {
    return this._ctx.arc(x, y, r, sAngle, eAngle, anticlockwise);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    return this._ctx.quadraticCurveTo(cpx, cpy, x, y);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    return this._ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  closePath(): void {
    return this._ctx.closePath();
  }
}

export default CanvasContextImplement;
