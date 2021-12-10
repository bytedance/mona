type Target = Record<string, unknown> & { dataset: Record<string, unknown>; id: string };

export interface MonaEvent {
  type: string;
  target: Target;
  currentTarget: Target;
  detail: Record<string, unknown>;
  stopPropagation?: any;
}
export const BUBBLE_EVENTS = [
  'onClick',
  'onTap',
  'onLongPress',
  'onLongTap',
  'onTouchStart',
  'onTouchMove',
  'onTouchEnd',
  'onTouchcancel',
  'onTransitionEnd',
  'onAnimationStart',
  'onAnimationIteration',
  'onAnimationEnd',
];

export const eventMap = {
  click: 'onClick',
  tap: 'onTap',
  longpress: 'onLongPress',
  longtap: 'onLongTap',
  touchstart: 'onTouchStart',
  touchmove: 'onTouchMove',
  touchend: 'onTouchEnd',
  touchcancel: 'onTouchcancel',
  transitionend: 'onTransitionEnd',
  animationstart: 'onAnimationStart',
  animationiteration: 'onAnimationIteration',
  animationend: 'onAnimationEnd',
};
// export const isPropagationStop: Record<string, boolean> = {};
