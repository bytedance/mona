export interface BaseTarget {
  // 事件源组件的 id
  id: string;
  // 当前组件类型
  tagName: string;
  /** 事件源组件上由 data-开头的自定义属性组成的集合*/
  dataset: Record<string, any>;
}

export interface BaseEvent<D = any> {
  /** 事件类型 */
  type: string;
  /** 事件生成时的时间戳 */
  timeStamp: number;
  /** 触发事件的组件的一些属性值集合 */
  target: BaseTarget;
  /** 当前组件的一些属性值集合 */
  currentTarget: BaseTarget;
  /** 额外的信息*/
  detail?: D;
}
export interface MonaExtraEvent {
  // 阻止冒泡
  stopPropagation?: () => void;
}

export interface Touch {
  identifier: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
}

export interface CanvasTouch {
  identifier: number;
  x: number;
  y: number;
}

export interface TouchEvent<T = Touch, D = any> extends BaseEvent<D> {
  touches: T[];
  changedTouches: T[];
}

export interface EventHandler {
  (event: BaseEvent): void;
}

export type MonaEvent<T, D> = TouchEvent<T, D> & MonaExtraEvent;

export interface TouchEventHandler<T = Touch, D = any> {
  (event: MonaEvent<T, D>): void;
}
