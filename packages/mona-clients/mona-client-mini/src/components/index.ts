import React from 'react';
import createBaseComponent from '../createBaseComponent';
import formatPath from '../utils/formatPath';

import {
  ButtonProps,
  ViewProps,
  ProgressProps,
  IconProps,
  ScrollViewProps,
  SwiperProps,
  SwiperItemProps,
  MovableAreaProps,
  MovableViewProps,
  CheckboxProps,
  CheckboxGroupProps,
  FormProps,
  InputProps,
  LabelProps,
  PickerProps,
  PickerViewProps,
  PickerViewColumnProps,
  RadioProps,
  RadioGroupProps,
  SliderProps,
  SwitchProps,
  TextareaProps,
  NavigatorProps,
  ImageProps,
  VideoProps,
  LivePlayerProps,
  CameraProps,
  CanvasProps,
  MapProps,
  WebviewProps,
  AdProps,
  OpenDataProps,
  LinkProps,
  TextProps,
  RichTextProps,
} from '@bytedance/mona';

export const Text = createBaseComponent<TextProps>('text');
export const RichText = createBaseComponent<RichTextProps>('rich-text');
export const Progress = createBaseComponent<ProgressProps>('progress');
export const Icon = createBaseComponent<IconProps>('icon');
export const View = createBaseComponent<ViewProps>('view');
export const ScrollView = createBaseComponent<ScrollViewProps>('scroll-view');
export const Swiper = createBaseComponent<SwiperProps>('swiper');
export const SwiperItem = createBaseComponent<SwiperItemProps>('swiper-item');
export const MovableArea = createBaseComponent<MovableAreaProps>('movable-area');
export const MovableView = createBaseComponent<MovableViewProps>('movable-view');
export const Button = createBaseComponent<ButtonProps>('button');
export const Checkbox = createBaseComponent<CheckboxProps>('checkbox');
export const CheckboxGroup = createBaseComponent<CheckboxGroupProps>('checkbox-group');
export const Form = createBaseComponent<FormProps>('form');
export const Input = createBaseComponent<InputProps>('input');
export const Label = createBaseComponent<LabelProps>('label');
export const Picker = createBaseComponent<PickerProps>('picker');
export const PickerView = createBaseComponent<PickerViewProps>('picker-view');
export const PickerViewColumn = createBaseComponent<PickerViewColumnProps>('picker-view-column');
export const Radio = createBaseComponent<RadioProps>('radio');
export const RadioGroup = createBaseComponent<RadioGroupProps>('radio-group');
export const Slider = createBaseComponent<SliderProps>('slider');
export const Switch = createBaseComponent<SwitchProps>('switch');
export const Textarea = createBaseComponent<TextareaProps>('textarea');
export const Navigator = createBaseComponent<NavigatorProps>('navigator');
export const Image = createBaseComponent<ImageProps>('image');
export const Video = createBaseComponent<VideoProps>('video');
export const LivePlayer = createBaseComponent<LivePlayerProps>('live-player');
export const Camera = createBaseComponent<CameraProps>('camera');
export const Canvas = createBaseComponent<CanvasProps>('canvas');
export const Map = createBaseComponent<MapProps>('map');
export const Webview = createBaseComponent<WebviewProps>('web-view');
export const Ad = createBaseComponent<AdProps>('ad');
export const OpenData = createBaseComponent<OpenDataProps>('open-data');
  // 自定义
export const Link = (function createBaseComponent(name) {
  const Component = React.forwardRef(({ children, to }: any, ref) =>
    React.createElement(name, { url: formatPath(to), ref }, children),
  );
  Component.displayName = name;
  return Component;
})('navigator') as React.ComponentType<LinkProps>;
