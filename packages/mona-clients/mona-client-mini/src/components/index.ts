// @ts-nocheck
import React from 'react';
import createBaseComponent from '../createBaseComponent';
import {
  BaseComponents,
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
// class MiniComponents extends BaseComponents {
class MiniComponents extends BaseComponents {
  Text = createBaseComponent<TextProps>('text');
  RichText = createBaseComponent<RichTextProps>('rich-text');
  Progress = createBaseComponent<ProgressProps>('progress');
  Icon = createBaseComponent<IconProps>('icon');
  View = createBaseComponent<ViewProps>('view');
  ScrollView = createBaseComponent<ScrollViewProps>('scroll-view');
  Swiper = createBaseComponent<SwiperProps>('swiper');
  SwiperItem = createBaseComponent<SwiperItemProps>('swiper-item');
  MovableArea = createBaseComponent<MovableAreaProps>('movable-area');
  MovableView = createBaseComponent<MovableViewProps>('movable-view');
  Button = createBaseComponent<ButtonProps>('button');
  Checkbox = createBaseComponent<CheckboxProps>('checkbox');
  CheckboxGroup = createBaseComponent<CheckboxProps>('checkbox-group');
  Form = createBaseComponent<FormProps>('form');
  Input = createBaseComponent<InputProps>('input');
  Label = createBaseComponent<LabelProps>('label');
  Picker = createBaseComponent<PickerProps>('picker');
  PickerView = createBaseComponent<PickerViewProps>('picker-view');
  PickerViewColumn = createBaseComponent<PickerViewColumnProps>('picker-view-column');
  Radio = createBaseComponent<RadioProps>('radio');
  RadioGroup = createBaseComponent<RadioGroupProps>('radio-group');
  Slider = createBaseComponent<SliderProps>('slider');
  Switch = createBaseComponent<SwitchProps>('switch');
  Textarea = createBaseComponent<TextareaProps>('textarea');
  Navigator = createBaseComponent<NavigatorProps>('ttnavigator');
  Image = createBaseComponent<ImageProps>('image');
  Video = createBaseComponent<VideoProps>('video');
  LivePlayer = createBaseComponent<LivePlayerProps>('live-player');
  Camera = createBaseComponent<CameraProps>('camera');
  Canvas = createBaseComponent<CanvasProps>('canvas');
  Map = createBaseComponent<MapProps>('map');
  Webview = createBaseComponent<WebviewProps>('web-view');
  Ad = createBaseComponent<AdProps>('ad');
  OpenData = createBaseComponent<OpenDataProps>('open-data');
  // 自定义
  Link = (function createBaseComponent(name) {
    const Component = React.forwardRef(({ children, to }, ref) =>
      React.createElement(name, { url: to, ref }, children),
    );
    Component.displayName = name;
    return Component;
  })('ttnavigator') as React.ComponentType<LinkProps>;
}

export default MiniComponents;
