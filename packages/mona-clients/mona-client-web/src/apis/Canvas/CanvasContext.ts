import { CanvasContext } from '@bytedance/mona';

class CanvasContextImplement implements CanvasContext {
  private _ctx: CanvasRenderingContext2D;
  private _offscreentCtx: CanvasRenderingContext2D;
  private _offscreentCanvas: HTMLCanvasElement;

  constructor(ele: HTMLCanvasElement | null) {
    if (!ele) {
      throw new Error("the canvas's element is empty!")
    }
    const ctx = ele.getContext('2d');
    if (!ctx) {
      throw new Error("can't get the context of canvas!")
    }
    this._ctx = ctx;
    
    const { context: octx, $canvas } = this.createOffscreenCtx(ele);
    if (!octx) {
      throw new Error("create offscreen canvas failed!")
    }
    this._offscreentCtx = octx;
    this._offscreentCanvas = $canvas;
  }

  private createOffscreenCtx(ele: HTMLCanvasElement) {
    const width = ele.offsetWidth;
    const height = ele.offsetHeight;

    const $canvas = document.createElement('canvas');
    $canvas.width = width;
    $canvas.height = height;
    const context = $canvas.getContext('2d');
    return { context, $canvas };
  }

  draw(reserve?: boolean, callback?: () => void): void {
    if (!reserve) {
      const width = this._offscreentCanvas.width;
      const height = this._offscreentCanvas.height;
      this._ctx.clearRect(0, 0, width, height);
    }
    this._ctx.drawImage(this._offscreentCanvas, 0, 0);
    if (typeof callback === 'function') {
      callback();
    }
  }

  setFontSize(fontSize: number): void {
    this._offscreentCtx.font = `${fontSize}px`;
  }

  setFillStyle(color: string): void {
    this._offscreentCtx.fillStyle = color;
  }

  setLineCap(lineCap: 'butt' | 'round' | 'square'): void {
    this._offscreentCtx.lineCap = lineCap;
  }

  setLineJoin(lineJoin: 'bevel' | 'round' | 'miter'): void {
    this._offscreentCtx.lineJoin = lineJoin;
  }

  setLineWidth(lineWidth: number): void {
    this._offscreentCtx.lineWidth = lineWidth;
  }

  setMiterLimit(miterLimit: number): void {
    this._offscreentCtx.miterLimit = miterLimit;
  }

  setTextBaseline(textBaseline: 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom'): void {
    this._offscreentCtx.textBaseline = textBaseline;
  }

  setStrokeStyle(color: string): void {
    this._offscreentCtx.strokeStyle = color;
  }

  setGlobalAlpha(alpha: number): void {
    this._offscreentCtx.globalAlpha = alpha;
  }

  setTextAlign(align: 'left' | 'center' | 'right'): void {
    this._offscreentCtx.textAlign = align;
  }

  setLineDash(pattern: number[], offset: number): void {
    this._offscreentCtx.setLineDash(pattern);
    this._offscreentCtx.lineDashOffset = offset;
  }

  createLinearGradient(sx: number, sy: number, dx: number, dy: number): CanvasGradient {
    return this._offscreentCtx.createLinearGradient(sx, sy, dx, dy);
  }

  setTransform(
    scaleX: number,
    skewX: number,
    skewY: number,
    scaleY: number,
    translateX: number,
    translateY: number
  ): void {
    return this._offscreentCtx.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);
  }

  beginPath(): void {
    return this._offscreentCtx.beginPath();
  }

  clip(): void {
    return this._offscreentCtx.clip();
  }

  lineTo(x: number, y: number): void {
    return this._offscreentCtx.lineTo(x, y);
  }

  transform(
    scaleX: number,
    skewX: number,
    skewY: number,
    scaleY: number,
    translateX: number,
    translateY: number
  ): void {
    return this._offscreentCtx.transform(scaleX, skewX, skewY, scaleY, translateX, translateY);
  }

  fill(): void {
    return this._offscreentCtx.fill();
  }

  stroke(): void {
    return this._offscreentCtx.stroke();
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    return this._offscreentCtx.fillRect(x, y, width, height);
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    return this._offscreentCtx.strokeRect(x, y, width, height);
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
    dh?: number
  ): void {
    // TODO
    const $image = document.createElement('img');
    $image.src = imageResource;
    return this._offscreentCtx.drawImage($image, sx, sy, sw || 0, sh || 0, dx || 0, dy || 0, dw || 0, dh || 0);
  }

  measureText(text: string): { width: number } {
    return this._offscreentCtx.measureText(text);
  }

  scale(scaleWidth: number, scaleHeight: number): void {
    return this._offscreentCtx.scale(scaleWidth, scaleHeight);
  }

  rotate(rotate: number): void {
    return this._offscreentCtx.rotate(rotate);
  }

  translate(x: number, y: number): void {
    return this._offscreentCtx.translate(x, y);
  }

  save(): void {
    return this._offscreentCtx.save();
  }

  restore(): void {
    return this._offscreentCtx.restore();
  }

  clearRect(x: number, y: number, width: number, height: number): void {
    return this._offscreentCtx.clearRect(x, y, width, height);
  }

  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    return this._offscreentCtx.fillText(text, x, y, maxWidth);
  }

  moveTo(x: number, y: number): void {
    return this._offscreentCtx.moveTo(x, y);
  }

  rect(x: number, y: number, width: number, height: number): void {
    return this._offscreentCtx.rect(x, y, width, height);
  }

  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, anticlockwise: boolean): void {
    return this._offscreentCtx.arc(x, y, r, sAngle, eAngle, anticlockwise);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    return this._offscreentCtx.quadraticCurveTo(cpx, cpy, x, y);
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    return this._offscreentCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  closePath(): void {
    return this._offscreentCtx.closePath();
  }
}

export default CanvasContextImplement;
