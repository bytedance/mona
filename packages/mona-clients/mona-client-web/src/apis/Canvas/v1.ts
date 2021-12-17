import { CanvasToTempFilePathOptions } from '@bytedance/mona';
import CanvasContext from "./CanvasContext";

function queryCanvasByCanvasId(canvasId: string): HTMLCanvasElement | null {
  return document.querySelector(`canvas[data-canvas-id='${canvasId}']`)
}

function createCanvasContext(canvasId: string) {
  const $canvas: HTMLCanvasElement | null = queryCanvasByCanvasId(canvasId);
  return new CanvasContext($canvas);
}

function canvasToTempFilePath(options: CanvasToTempFilePathOptions) {
  const { canvasId, width, height, destWidth, destHeight, x = 0, y = 0, success = () => {}, fail = () => {}, complete = () => {} } = options;
  let res: any = { errMsg: 'canvasToTempFilePath:ok' }
  try {
    const $canvas: HTMLCanvasElement | null = queryCanvasByCanvasId(canvasId);
    if ($canvas) {
      const $offscreenCanvas = document.createElement('canvas');
      const realWidth = width || $canvas.offsetWidth;
      const realHeight = height || $canvas.offsetHeight;
      $offscreenCanvas.width = destWidth || realWidth;
      $offscreenCanvas.height = destHeight || realHeight;
      
      const context = $offscreenCanvas.getContext('2d');
      context?.drawImage($canvas, x, y, realWidth, realHeight);
      const tempFilePath = $offscreenCanvas.toDataURL();
      res = { errMsg: 'canvasToTempFilePath:ok', tempFilePath }
      success(res)
    }
  } catch (err: any) {
    res = { errMsg: "canvasToTempFilePath:fail " + err.message }
    fail(res)
  } finally {
    complete(res)
  }
}

export {
  createCanvasContext,
  canvasToTempFilePath
}