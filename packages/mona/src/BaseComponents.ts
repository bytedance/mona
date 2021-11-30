import React from 'react';
// base
interface BaseProps<T = Touch> {
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
  onTransitionEnd?: TouchEventHandler<T>;
  onAnimationStart?: TouchEventHandler<T>;
  onAnimationIteration?: TouchEventHandler<T>;
  onAnimationEnd?: TouchEventHandler<T>;
  onTouchForceChange?: TouchEventHandler<T>;
}

interface HoverProps {
  hoverClassName?: string;
  hoverStartTime?: number;
  hoverStayTime?: number;
  hoverStopPropagation?: boolean;
}

interface BaseTarget {
  id: string;
  tagName: string;
  dataset: Record<string, any>;
}

interface BaseEvent {
  type: string;
  timeStamp: number;
  target: BaseTarget
  currentTarget: BaseTarget;
}

interface Touch {
  identifier: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
}

interface CanvasTouch {
  identifier: number;
  x: number;
  y: number;
}

interface TouchEvent<T> extends BaseEvent {
  touches: T[];
  changedTouches: T[];
}

interface EventHandler {
  (event: BaseEvent): void
}

interface TouchEventHandler<T> {
  (event: TouchEvent<T>): void
}

// 基础内容
export interface TextProps extends BaseProps {
  selectable?: boolean;
  space?: 'ensp' | 'emsp' | 'nbsp';
  decode?: boolean;
}

interface RichTextNodeTypeNode {
  name: string;
  type?: string;
  attrs?: Record<string, any>;
  children?: Array<RichTextNode>
}

interface RichTextNodeTypeText {
  text: string;
  type: string;
}

type RichTextNode = RichTextNodeTypeNode | RichTextNodeTypeText;

export interface RichTextProps extends BaseProps {
  nodes: RichTextNode[] | string
}

export interface ProgressProps extends BaseProps {
  percent?: number;
  strokeWidth?: number;
  color?: string;
  activeColor?: string;
  backgroundColor?: string;
  active?: boolean;
  activeMode?: string;
}

export interface IconProps extends BaseProps {
  type: 'success' | 'success_no_circle' | 'info' | 'warn' | 'warning' | 'clear' | 'cancel' | 'download' | 'search'
  size?: number;
  color?: string;
}

// 视图容器
export interface ViewProps extends BaseProps, HoverProps {
  
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
  onChange?: EventHandler;
  onAnimationFinish?: EventHandler;
  onTransition?: EventHandler;
}

export interface SwiperItemProps extends BaseProps {
  itemId?: string
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
  value?: string
  disabled?: boolean;
  checked?: boolean
  color?: string
}

export interface CheckboxGroupProps extends BaseProps {
  onChange?: EventHandler;
  name?: string;
}

export interface FormProps extends BaseProps {
  onSubmit?: EventHandler;
  onReset?: EventHandler;
}

export interface InputProps extends BaseProps {
  value?: string;
  type?: 'text' | 'number' | 'digit';
  password?: string;
  placeholder?: string;
  placeholderStyle?: string;
  disabled?: boolean;
  maxLength?: number;
  focus?: boolean;
  cursorSpacing?: number;
  cursor?: number;
  selectionStart?: number;
  selectionEnd?: number;
  onInput?: EventHandler;
  onFocus?: EventHandler;
  onBlur?: EventHandler;
  onConfirm?: EventHandler;
  adjustPosition?: boolean;
  confirmType?: 'send' | 'search' | 'next' | 'go' | 'done';
}

export interface LabelProps extends BaseProps {
  for?: string;
}

export interface PickerProps extends BaseProps {
  mode?: 'selector' | 'multiSelector' | 'time' | 'date' | 'region';
  range?: (string | Record<string, any>)[][]
  rangeKey?: string;
  value?: number[] | string[] | string;
  start?: string;
  end?: string;
  fields?: 'year' | 'month' | 'day';
  disabled?: boolean;
  customItem?: string;
  onCancel?: EventHandler;
  onChange?: EventHandler;
  onColumnChange?: EventHandler;
}

export interface PickerViewProps extends BaseProps {
  value: number[];
  indicatorStyle?: string;
  maskStyle?: string;
  onChange?: EventHandler
}

export interface PickerViewColumnProps extends BaseProps {
  
}

export interface RadioProps extends BaseProps {
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  color?: string;
}

export interface RadioGroupProps extends BaseProps {
  onChange?: EventHandler;
  name?: string;
}

export interface SliderProps extends BaseProps {
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
  checked?: boolean;
  disabled?: boolean;
  type?: 'switch' | 'checkbox';
  color?: string;
  onChange?: EventHandler;
}

export interface TextareaProps extends BaseProps {
  value?: string;
  placeholder?: string;
  placeholderStyle?: string;
  disabled?: boolean;
  maxLength?: number;
  focus?: boolean;
  autoHeight?: boolean;
  fixed?: boolean;
  cursorSpacing?: number;
  selectionStart?: number;
  selectionEnd?: number;
  disableDefaultPadding?: boolean;
  onInput?: EventHandler;
  onFocus?: EventHandler;
  onBlur?: EventHandler;
  onConfirm?: EventHandler;
}

// 导航
export interface NavigatorProps extends BaseProps, HoverProps {
  url: string;
  delta?: number;
  openType?: 'navigate' | 'redirect' | 'switchTab' | 'navigateBack' | 'reLaunch';
}

// 媒体
type ImageMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'

export interface ImageProps extends BaseProps {
  src?: string;
  mode?: ImageMode;
  lazyLoad?: boolean;
  onError?: EventHandler;
  onLoad?: EventHandler;
}

export interface VideoProps extends BaseProps {
  src: string;
  autoplay?: boolean;
  poster?: string;
  loop?: boolean;
  showFullscreenBtn?: boolean;
  showPlayBtn?: boolean;
  controls?: boolean;
  objectFit?: 'contain' | 'fill' | 'cover';
  playBtnPosition?: 'center' | 'bottom';
  preRollUnitId?: string;
  postRollUnitId?: string;
  vslideGestureInFullscreen?: boolean;
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
  textAlign?: 'left' | 'center' | 'right'
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
  abstract Text: React.ComponentType<TextProps>
  abstract RichText: React.ComponentType<RichTextProps>
  abstract Progress: React.ComponentType<ProgressProps>
  abstract Icon: React.ComponentType<IconProps>
  // 视图容器
  abstract View: React.ComponentType<ViewProps>
  abstract ScrollView: React.ComponentType<ScrollViewProps>
  abstract Swiper: React.ComponentType<SwiperProps>
  abstract SwiperItem: React.ComponentType<SwiperItemProps>
  abstract MovableArea: React.ComponentType<MovableAreaProps>
  abstract MovableView: React.ComponentType<MovableViewProps>
  // 表单
  abstract Button: React.ComponentType<ButtonProps>
  abstract Checkbox: React.ComponentType<CheckboxProps>
  abstract CheckboxGroup: React.ComponentType<CheckboxGroupProps>
  abstract Form: React.ComponentType<FormProps>
  abstract Input: React.ComponentType<InputProps>
  abstract Label: React.ComponentType<LabelProps>
  abstract Picker: React.ComponentType<PickerProps>
  abstract PickerView: React.ComponentType<PickerViewProps>
  abstract PickerViewColumn: React.ComponentType<PickerViewColumnProps>
  abstract Radio: React.ComponentType<RadioProps>
  abstract RadioGroup: React.ComponentType<RadioGroupProps>
  abstract Slider: React.ComponentType<SliderProps>
  abstract Switch: React.ComponentType<SwitchProps>
  abstract Textarea: React.ComponentType<TextareaProps>
  // 导航
  abstract Navigator: React.ComponentType<NavigatorProps>
  // 媒体
  abstract Image: React.ComponentType<ImageProps>
  abstract Video: React.ComponentType<VideoProps>
  abstract LivePlayer: React.ComponentType<LivePlayerProps>
  abstract Camera: React.ComponentType<CameraProps>
  // 画布
  abstract Canvas: React.ComponentType<CanvasProps>
  // 地图
  abstract Map: React.ComponentType<MapProps>
  // 开放能力
  abstract Webview: React.ComponentType<WebviewProps>
  abstract Ad: React.ComponentType<AdProps>
  abstract OpenData: React.ComponentType<OpenDataProps>
  // 自定义
  abstract Link: React.ComponentType<LinkProps>
}

export default BaseComponents;