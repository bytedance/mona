type Target = Record<string, unknown> & { dataset: Record<string, unknown>; id: string };

export interface MonaEvent {
  type: string;
  target: Target;
  currentTarget: Target;
  detail: Record<string, unknown>;
  stopPropagation?: any;
}
// export const BUBBLE_EVENTS = [
//   'onClick',
//   'onTap',
//   'onLongPress',
//   'onLongTap',
//   'onTouchStart',
//   'onTouchMove',
//   'onTouchEnd',
//   'onTouchCancel',
//   'onTransitionEnd',
//   'onAnimationStart',
//   'onAnimationIteration',
//   'onAnimationEnd',
//   'onTouchForceChange'
// ];

// obj is faster than Map and Set; 
export const bubbleEventMap: Record<string, true> = {
  onClick: true,
  onTap: true,
  onLongPress: true,
  onLongTap: true,
  onTouchStart: true,
  onTouchMove: true,
  onTouchEnd: true,
  onTouchCancel: true,
  onTransitionEnd: true,
  onAnimationStart: true,
  onAnimationIteration: true,
  onAnimationEnd: true,
  onTouchForceChange: true,
};

// Object.keys(bubbleEventMap).forEach(item => {
//   eventReactAliasMap[item.slice(2).toLowerCase()] = item;
// })

export const eventReactAliasMap: Record<string, string> = {
  click: 'onClick',
  tap: 'onTap',
  longpress: 'onLongPress',
  longtap: 'onLongTap',
  touchstart: 'onTouchStart',
  touchmove: 'onTouchMove',
  touchend: 'onTouchEnd',
  touchcancel: 'onTouchCancel',
  transitionend: 'onTransitionEnd',
  animationstart: 'onAnimationStart',
  animationiteration: 'onAnimationIteration',
  animationend: 'onAnimationEnd',
  touchforcechange: 'onTouchForceChange',
};

// Object.keys(bubbleEventMap).forEach(item => {
//   isPropagationStop[item.slice(2).toLowerCase()] = false;
// });
// obj is faster than Map and Set; 
export const isPropagationStop: Record<string, boolean> = {
  click: false,
  tap: false,
  longpress: false,
  longtap: false,
  touchstart: false,
  touchmove: false,
  touchend: false,
  touchcancel: false,
  transitionend: false,
  animationstart: false,
  animationiteration: false,
  animationend: false,
  touchforcechange: false,
};
