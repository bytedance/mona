import React from 'react';
import { XOR } from './util';
// base
export interface BaseProps<T = Touch> {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  hidden?: boolean;
  // 事件
  onTouchStart?: TouchEventHandler<T>;
  onTouchMove?: TouchEventHandler<T>;
  onTouchCancel?: TouchEventHandler<T>;
  onTouchEnd?: TouchEventHandler<T>;
  onTap?: TouchEventHandler<T>;
  onLongPress?: TouchEventHandler<T>;
  onLongTap?: TouchEventHandler<T>;
  onTransitionEnd?: TouchEventHandler<T, { elapsedTime: number }>;
  onAnimationStart?: TouchEventHandler<T>;
  onAnimationIteration?: TouchEventHandler<T>;
  onAnimationEnd?: TouchEventHandler<T>;
  onTouchForceChange?: TouchEventHandler<T>;
  // 非冒泡事件
  catchTouchStart?: TouchEventHandler<T>;
  catchTouchMove?: TouchEventHandler<T>;
  catchTouchCancel?: TouchEventHandler<T>;
  catchTouchEnd?: TouchEventHandler<T>;
  catchTap?: TouchEventHandler<T>;
  catchLongPress?: TouchEventHandler<T>;
  catchLongTap?: TouchEventHandler<T>;
  catchTransitionEnd?: TouchEventHandler<T>;
  catchAnimationStart?: TouchEventHandler<T>;
  catchAnimationIteration?: TouchEventHandler<T>;
  catchAnimationEnd?: TouchEventHandler<T>;
  catchTouchForceChange?: TouchEventHandler<T>;
}

export interface HoverProps {
  hoverClassName?: string;
  hoverStartTime?: number;
  hoverStayTime?: number;
  hoverStopPropagation?: boolean;
}

export interface BaseTarget {
  id: string;
  tagName: string;
  dataset: Record<string, any>;
}

export interface BaseEvent<D = any> {
  type: string;
  timeStamp: number;
  target: BaseTarget;
  currentTarget: BaseTarget;
  detail?: D;
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

export interface TouchEventHandler<T = Touch, D = any> {
  (event: TouchEvent<T, D> & {stopPropagation?: () => void } ): void;
}

// 基础内容
export interface TextProps extends BaseProps {
  selectable?: boolean;
  space?: 'ensp' | 'emsp' | 'nbsp';
  decode?: boolean;
}

export interface RichTextNodeTypeNode {
  name: string;
  type?: string;
  attrs?: Record<string, any>;
  children?: Array<RichTextNode>;
}

export interface RichTextNodeTypeText {
  text: string;
  type: string;
}

export type RichTextNode = RichTextNodeTypeNode | RichTextNodeTypeText;

export interface RichTextProps extends BaseProps {
  nodes?: RichTextNode[] | string;
}

export interface ProgressProps extends BaseProps {
  percent?: number;
  strokeWidth?: number;
  color?: string;
  activeColor?: string;
  backgroundColor?: string;
  active?: boolean;
  activeMode?: 'backwards' | 'forwards';
}

export interface IconProps extends BaseProps {
  type: 'success' | 'success_no_circle' | 'info' | 'warn' | 'warning' | 'clear' | 'cancel' | 'download' | 'search';
  size?: number;
  color?: string;
}

// 视图容器
export interface ViewProps extends BaseProps, HoverProps {
  slot?: string;
}

export interface ScrollViewProps extends BaseProps {
  scrollX?: boolean;
  scrollY?: boolean;
  scrollWithAnimation?: boolean;
  upperThreshold?: number;
  lowerThreshold?: number;
  scrollTop?: number;
  scrollLeft?: number;
  scrollIntoView?: string;
  onScroll?: EventHandler;
  onScrollToUpper?: EventHandler;
  onScrollToLower?: EventHandler;
}

export type SwiperChangeEvent = TouchEvent<Touch, { current: number; source: 'autoplay' | 'touch' }>;
export type SwiperAnimationFinishEvent = SwiperChangeEvent;
export type SwiperTransitionEvent = TouchEvent<Touch, { dy: number; dx: number }>;
export interface SwiperProps extends BaseProps {
  indicatorDots?: boolean;
  indicatorColor?: string;
  indicatorActiveColor?: string;
  autoplay?: boolean;
  current?: number;
  currentItemId?: string;
  interval?: number;
  previousMargin?: string;
  nextMargin?: string;
  displayMultipleItems?: number;
  duration?: number;
  circular?: boolean;
  vertical?: boolean;
  onChange?: (event: SwiperChangeEvent) => void;
  onAnimationFinish?: (event: SwiperAnimationFinishEvent) => void;
  onTransition?: (event: SwiperTransitionEvent) => void;
}

export interface SwiperItemProps extends BaseProps {
  itemId?: string;
}

export interface MovableAreaProps extends BaseProps {
  scaleArea?: boolean;
}

export interface MovableViewProps extends BaseProps {
  direction?: 'all' | 'vertical' | 'horizontal' | 'none';
  inertia?: boolean;
  outOfBounds?: boolean;
  x?: string | number;
  y?: string | number;
  damping?: number;
  friction?: number;
  disabled?: boolean;
  scale?: boolean;
  scaleMin?: number;
  scaleMax?: number;
  scaleValue?: number;
  animation?: boolean;
  onChange?: EventHandler;
  onScale?: EventHandler;
  onHtouchMove?: EventHandler;
  onVtouchMove?: EventHandler;
}

// 表单
export interface ButtonProps extends BaseProps, HoverProps {
  size?: 'default' | 'mini';
  type?: 'primary' | 'default';
  disabled?: boolean;
  loading?: boolean;
  formType?: 'submit' | 'reset';
  openType?: 'share' | 'getPhoneNumber' | 'contact';
  onGetPhoneNumber?: EventHandler;
}

export interface CheckboxProps extends BaseProps {
  value?: string;
  disabled?: boolean;
  checked?: boolean;
  color?: string;
}

export interface CheckboxGroupProps extends BaseProps {
  onChange?: (event: TouchEvent<Touch, { value?: string[] }>) => void;
  name?: string;
}

type FormSumbitEventHandler = (e: BaseEvent<{ value: Record<string, any> }>) => void;
export interface FormProps extends BaseProps {
  onSubmit?: FormSumbitEventHandler;
  onReset?: EventHandler;
}

type InputEventHandler = (e: BaseEvent<{ cursor: number; value: string }>) => void;
type FocusEventHandler = (e: BaseEvent<{ value: string; height: number }>) => void;
type BlurEventHandler = (e: BaseEvent<{ value: string }>) => void;
type ConfirmEventHandler = BlurEventHandler;

export interface InputProps extends BaseProps {
  value?: string;
  name?: string;
  type?: 'text' | 'number' | 'digit';
  password?: boolean;
  placeholder?: string;
  placeholderStyle?: React.CSSProperties;
  disabled?: boolean;
  maxLength?: number;
  focus?: boolean;
  cursorSpacing?: number;
  cursor?: number;
  selectionStart?: number;
  selectionEnd?: number;
  onInput?: InputEventHandler;
  onFocus?: FocusEventHandler;
  onBlur?: BlurEventHandler;
  onConfirm?: ConfirmEventHandler;
  adjustPosition?: boolean;
  confirmType?: 'send' | 'search' | 'next' | 'go' | 'done';
}

export interface LabelProps extends BaseProps {
  for?: string;
}
// ===== Picker =======
type PickerMode = 'selector' | 'multiSelector' | 'time' | 'date' | 'region';

interface PickerPropsMap extends BaseProps {
  selector: SelectorPickerProps;
  multiSelector: MultipleSelectorPickerProps;
  time: TimePickerProps;
  date: DatePickerProps;
  region: RegionPickerProps;
}

interface SelectorPickerProps {
  range?: string[] | any[];
  rangeKey?: string;
  value?: number;
  onChange?: EventHandler;
  disabled?: boolean;
  onCancel?: EventHandler;
  name?: string;
}

type MultipleSelectorPickerProps = SelectorPickerProps & {
  range?: string[] | any[];
  rangeKey?: string;
  value?: number[];
  onChange?: EventHandler;
  onColumnChange?: EventHandler;

  disabled?: boolean;
  onCancel?: EventHandler;
  name?: string;
};

interface TimePickerProps {
  value?: string;
  start?: string;
  end?: string;
  onChange?: EventHandler;
  disabled?: boolean;
  onCancel?: EventHandler;
  name?: string;
}

type DatePickerProps = TimePickerProps & { fields?: string };

interface RegionPickerProps {
  name?: string;
  value?: any[];
  customItem?: string;
  onChange?: EventHandler;
  disabled?: boolean;
  onCancel?: EventHandler;
}

export type PickerPropsSelect<T> = T extends PickerMode ? { mode: T } & PickerPropsMap[T] : never;
export type PickerProps = PickerPropsSelect<PickerMode>;

export type AllPickerProps = MultipleSelectorPickerProps &
  SelectorPickerProps &
  DatePickerProps &
  TimePickerProps &
  RegionPickerProps & { mode: PickerMode };
export interface PickerViewProps extends BaseProps {
  value: number[];
  indicatorStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  onChange?: EventHandler;
}

export interface PickerViewColumnProps extends BaseProps {}

export interface RadioProps extends BaseProps {
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  color?: string;
}

export interface RadioGroupProps extends BaseProps {
  onChange?: (event: TouchEvent<Touch, { value?: string }>) => void;
  name?: string;
}

export interface SliderProps extends BaseProps {
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  value?: number;
  color?: string;
  selectedColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  blockSize?: number;
  blockColor?: string;
  showValue?: boolean;
  onChange?: EventHandler;
  onChanging?: EventHandler;
}

export interface SwitchProps extends BaseProps {
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  type?: 'switch' | 'checkbox';
  color?: string;
  onChange?: EventHandler;
}

export interface TextareaProps extends BaseProps {
  name?: string;
  value?: string;
  placeholder?: string;
  placeholderStyle?: React.CSSProperties;
  disabled?: boolean;
  maxLength?: number;
  focus?: boolean;
  autoHeight?: boolean;
  fixed?: boolean;
  cursorSpacing?: number;
  cursor?: number;
  selectionStart?: number;
  selectionEnd?: number;
  disableDefaultPadding?: boolean;
  onInput?: InputEventHandler;
  onFocus?: FocusEventHandler;
  onBlur?: BlurEventHandler;
  onConfirm?: ConfirmEventHandler;
}

// 导航
export interface NavigatorProps extends BaseProps, HoverProps {
  url: string;
  delta?: number;
  openType?: 'navigate' | 'redirect' | 'switchTab' | 'navigateBack' | 'reLaunch';
}

// 媒体
type ImageMode =
  | 'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'heightFix'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';

export interface ImageProps extends BaseProps {
  src?: string;
  mode?: ImageMode;
  lazyLoad?: boolean;
  onError?: EventHandler;
  onLoad?: EventHandler;
}

export interface VideoBaseProps extends BaseProps {
  src: string;
  autoplay?: boolean;
  poster?: string;
  loop?: boolean;
  showFullscreenBtn?: boolean;
  objectFit?: 'contain' | 'fill' | 'cover';
  playBtnPosition?: 'center' | 'bottom';
  preRollUnitId?: string;
  postRollUnitId?: string;
  vslideGestureInFullscreen?: boolean;
  vslideGesture?: boolean;
  enableProgressGesture?: boolean;
  enablePlayGesture?: boolean;
  muted?: boolean;
  showMuteBtn?: boolean;
  showPlaybackRateBtn?: boolean;
  direction?: 0 | 90 | -90;
  enablePlayInBackground?: boolean;
  onPlay?: EventHandler;
  onPause?: EventHandler;
  onEnded?: EventHandler;
  onError?: EventHandler;
  onTimeUpdate?: EventHandler;
  onFullscreenChange?: EventHandler;
  onWaiting?: EventHandler;
  onAdStart?: EventHandler;
  onAdEnded?: EventHandler;
  onAdLoad?: EventHandler;
  onAdClose?: EventHandler;
  onAdError?: EventHandler;
  onLoadedMetaData?: EventHandler;
  onSeekComplete?: EventHandler;
  onPlayBackRateChange?: EventHandler;
  onMuteChange?: EventHandler;
  onControlTap?: EventHandler;
  onEnterBackground?: EventHandler;
  onCloseBackground?: EventHandler;
  onLeaveBackground?: EventHandler;
}
export type VideoProps = XOR<Control, ShowPlayBtn>;
type Control = {
  controls: boolean;
} & VideoBaseProps;

type ShowPlayBtn = {
  showPlayBtn: boolean;
} & VideoBaseProps;

export interface LivePlayerProps extends BaseProps {
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  orientation?: 'vertical' | 'horizontal';
  objectFit?: 'contain' | 'fillCrop';
  onStateChange?: EventHandler;
  onFullscreenChange?: EventHandler;
  onError?: EventHandler;
}

export interface CameraProps extends BaseProps {
  resolution?: 'low' | 'medium' | 'high';
  devicePosition?: 'front' | 'back';
  flash?: 'off' | 'torch';
  frameSize?: 'small' | 'medium' | 'large';
  onInitDone?: EventHandler;
  onError?: EventHandler;
  onStop?: EventHandler;
}

// 画布
export interface CanvasProps extends BaseProps<CanvasTouch> {
  canvasId: string;
  type: '2d' | 'webgl';
}

// 地图
interface Circle {
  latitude: number;
  longtitude: number;
  color?: string;
  fillColor?: string;
  radius?: number;
  strokeWidth?: number;
}

interface Point {
  longtitude: number;
  latitude: number;
}

interface Polyline {
  points: Point[];
  color?: string;
  width?: number;
  dottedLine?: boolean;
}

interface Callout {
  content?: string;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
  padding?: number;
  display?: 'BYCLICK' | 'ALWAYS';
  textAlign?: 'left' | 'center' | 'right';
}

interface Marker {
  id?: number;
  latitude: number;
  longtitude: number;
  title?: string;
  iconPath?: string;
  width?: number;
  height?: number;
  zIndex?: number;
  callout?: Callout;
}

export interface MapProps extends BaseProps {
  longtitude: number;
  latitude: number;
  scale?: number;
  markers?: Marker[];
  circles?: Circle[];
  showLocation?: boolean;
  polyline?: Polyline[];
  includePoints?: Point[];
  onTap?: EventHandler;
  onMarkerTap?: EventHandler;
  onCalloutTap?: EventHandler;
  onRegionChange?: EventHandler;
}

// 开放能力
export interface WebviewProps extends BaseProps {
  src: string;
  progressBarColor?: string;
  onMessage?: EventHandler;
  onLoad?: EventHandler;
  onError?: EventHandler;
}

export interface AdProps extends BaseProps {
  unitId: string;
  onLoad?: EventHandler;
  onError?: EventHandler;
  onClose?: EventHandler;
  adIntervals?: number;
  fixed?: boolean;
  type?: 'banner' | 'video' | 'large' | 'llmg' | 'rlmg';
  scale?: number;
}

export interface OpenDataProps extends BaseProps {
  type: 'userNickName' | 'userAvatarUrl' | 'userGender' | 'userCity' | 'userProvince' | 'userCountry';
  defaultText?: string;
  defaultAvatar?: string;
  useEmptyValue?: boolean;
  onError?: EventHandler;
}

export interface LinkProps extends BaseProps {
  to: string;
}

abstract class BaseComponents {
  // 基础内容
  abstract Text: React.ComponentType<TextProps>;
  abstract RichText: React.ComponentType<RichTextProps>;
  abstract Progress: React.ComponentType<ProgressProps>;
  abstract Icon: React.ComponentType<IconProps>;
  // 视图容器
  abstract View: React.ComponentType<ViewProps>;
  abstract ScrollView: React.ComponentType<ScrollViewProps>;
  abstract Swiper: React.ComponentType<SwiperProps>;
  abstract SwiperItem: React.ComponentType<SwiperItemProps>;
  abstract MovableArea: React.ComponentType<MovableAreaProps>;
  abstract MovableView: React.ComponentType<MovableViewProps>;
  // 表单
  abstract Button: React.ComponentType<ButtonProps>;
  abstract Checkbox: React.ComponentType<CheckboxProps>;
  abstract CheckboxGroup: React.ComponentType<CheckboxGroupProps>;
  abstract Form: React.ComponentType<FormProps>;
  abstract Input: React.ComponentType<InputProps>;
  abstract Label: React.ComponentType<LabelProps>;
  abstract Picker: React.ComponentType<PickerProps>;
  abstract PickerView: React.ComponentType<PickerViewProps>;
  abstract PickerViewColumn: React.ComponentType<PickerViewColumnProps>;
  abstract Radio: React.ComponentType<RadioProps>;
  abstract RadioGroup: React.ComponentType<RadioGroupProps>;
  abstract Slider: React.ComponentType<SliderProps>;
  abstract Switch: React.ComponentType<SwitchProps>;
  abstract Textarea: React.ComponentType<TextareaProps>;
  // 导航
  abstract Navigator: React.ComponentType<NavigatorProps>;
  // 媒体
  abstract Image: React.ComponentType<ImageProps>;
  abstract Video: React.ComponentType<VideoProps>;
  abstract LivePlayer: React.ComponentType<LivePlayerProps>;
  abstract Camera: React.ComponentType<CameraProps>;
  // 画布
  abstract Canvas: React.ComponentType<CanvasProps>;
  // 地图
  abstract Map: React.ComponentType<MapProps>;
  // 开放能力
  abstract Webview: React.ComponentType<WebviewProps>;
  abstract Ad: React.ComponentType<AdProps>;
  abstract OpenData: React.ComponentType<OpenDataProps>;
  // 自定义
  abstract Link: React.ComponentType<LinkProps>;
}

export default BaseComponents;
