import React from 'react';
import createBaseComponent from '../createBaseComponent';
import { ComponentType } from '@bytedance/mona-shared';
import { formatPath } from '@bytedance/mona-shared';

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

export const Text = createBaseComponent<TextProps>(ComponentType['text']);
export const RichText = createBaseComponent<RichTextProps>(ComponentType['rich-text']);
export const Progress = createBaseComponent<ProgressProps>(ComponentType['progress']);
export const Icon = createBaseComponent<IconProps>(ComponentType['icon']);
export const View = createBaseComponent<ViewProps>(ComponentType['view']);
export const ScrollView = createBaseComponent<ScrollViewProps>(ComponentType['scroll-view']);
export const Swiper = createBaseComponent<SwiperProps>(ComponentType['swiper']);
export const SwiperItem = createBaseComponent<SwiperItemProps>(ComponentType['swiper-item']);
export const MovableArea = createBaseComponent<MovableAreaProps>(ComponentType['movable-area']);
export const MovableView = createBaseComponent<MovableViewProps>(ComponentType['movable-view']);
export const Button = createBaseComponent<ButtonProps>(ComponentType['button']);
export const Checkbox = createBaseComponent<CheckboxProps>(ComponentType['checkbox']);
export const CheckboxGroup = createBaseComponent<CheckboxGroupProps>(ComponentType['checkbox-group']);
export const Form = createBaseComponent<FormProps>(ComponentType['form']);
export const Input = createBaseComponent<InputProps>(ComponentType['input']);
export const Label = createBaseComponent<LabelProps>(ComponentType['label']);
export const Picker = createBaseComponent<PickerProps>(ComponentType['picker']);
export const PickerView = createBaseComponent<PickerViewProps>(ComponentType['picker-view']);
export const PickerViewColumn = createBaseComponent<PickerViewColumnProps>(ComponentType['picker-view-column']);
export const Radio = createBaseComponent<RadioProps>(ComponentType['radio']);
export const RadioGroup = createBaseComponent<RadioGroupProps>(ComponentType['radio-group']);
export const Slider = createBaseComponent<SliderProps>(ComponentType['slider']);
export const Switch = createBaseComponent<SwitchProps>(ComponentType['switch']);
export const Textarea = createBaseComponent<TextareaProps>(ComponentType['textarea']);
export const Navigator = (function createBaseComponent(name) {
  const Component = React.forwardRef(({ children, url, ...props }: any, ref) =>
    React.createElement(name, { url: formatPath(url), ...props, ref }, children),
  );
  Component.displayName = name;
  return Component;
})(ComponentType['navigator']) as React.ComponentType<NavigatorProps>;
export const Image = createBaseComponent<ImageProps>(ComponentType['image']);
export const Video = createBaseComponent<VideoProps>(ComponentType['video']);
export const LivePlayer = createBaseComponent<LivePlayerProps>(ComponentType['live-player']);
export const Camera = createBaseComponent<CameraProps>(ComponentType['camera']);
export const Canvas = createBaseComponent<CanvasProps>(ComponentType['canvas']);
export const Map = createBaseComponent<MapProps>(ComponentType['map']);
export const Webview = createBaseComponent<WebviewProps>(ComponentType['web-view']);
export const Ad = createBaseComponent<AdProps>(ComponentType['ad']);
export const OpenData = createBaseComponent<OpenDataProps>(ComponentType['open-data']);
// 自定义
export const Link = (function createBaseComponent(name) {
  const Component = React.forwardRef(({ children, to }: any, ref) =>
    React.createElement(name, { url: formatPath(to), ref }, children),
  );
  Component.displayName = name;
  return Component;
})(ComponentType['navigator']) as React.ComponentType<LinkProps>;
