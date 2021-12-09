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
const componentsMap: Record<string, { node: any; defaultProps: any }> = {
  Text: {
    node: createBaseComponent<TextProps>('text'),
    defaultProps: { selectable: false, space: false, decode: false },
  },
  Block: { node: createBaseComponent<TextProps>('block') },
  RichText: { node: { node: createBaseComponent<RichTextProps>('rich-text') } },
  Progress: {
    node: createBaseComponent<ProgressProps>('progress'),
    defaultProps: {
      percent: 0,
      strokeWidth: 6,
      color: '#F85959',
      activeColor: '#F85959',
      backgroundColor: '#EBEBEB',
      active: false,
      activeMode: 'backwards',
    },
  },
  Icon: {
    node: createBaseComponent<IconProps>('icon'),
    defaultProps: {
      size: 24,
    },
  },
  View: {
    node: createBaseComponent<ViewProps>('view'),
    defaultProps: {
      hoverClassName: 'none',
      hoverStartTime: 50,
      hoverStayTime: 400,
      hoverStopPropagation: false,
    },
  },
  ScrollView: {
    node: createBaseComponent<ScrollViewProps>('scroll-view'),
    defaultProps: {
      scrollX: false,
      scrollY: false,
      upperThreshold: 50,
      lowerThreshold: 50,
      scrollWithAnimation: false,
    },
  },
  Swiper: {
    node: createBaseComponent<SwiperProps>('swiper'),
    defaultProps: {
      indicatorDots: false,
      indicatorColor: 'rgba(0, 0, 0, 0.3)',
      indicatorActiveColor: 'rgba(0, 0, 0, 0)',
      autoplay: false,
      current: 0,
      currentItemId: '',
      interval: 5000,
      previousMargin: '',
      nextMargin: '',
      displayMultipleItems: 1,
      duration: 500,
      circular: false,
      vertical: false,
    },
  },
  SwiperItem: { node: createBaseComponent<SwiperItemProps>('swiper-item') },
  MovableArea: { node: createBaseComponent<MovableAreaProps>('movable-area') },
  MovableView: { node: createBaseComponent<MovableViewProps>('movable-view') },
  Button: {
    node: createBaseComponent<ButtonProps>('button'),
    defaultProps: {
      size: 'default',
      type: 'default',
      disabled: false,
      loading: false,
      hoverClassName: 'button-hover',
      hoverStartTime: 20,
      hoverStayTime: 70,
      hoverStopPropagation: false,
    },
  },
  Checkbox: {
    node: createBaseComponent<CheckboxProps>('checkbox'),
    defaultProps: {
      disabled: false,
      checked: false,
    },
  },
  CheckboxGroup: { node: createBaseComponent<CheckboxProps>('checkbox-group') },
  Form: {
    node: createBaseComponent<FormProps>('form'),
    defaultProps: {
      reportSubmit: false,
    },
  },
  Input: {
    node: createBaseComponent<InputProps>('input'),
    defaultProps: {
      type: 'text',
      password: false,
      value: '',
      disabled: false,
      maxLength: 140,
      focus: false,
      selectionEnd: -1,
      selectionStart: -1,
      cursorSpacing: 0,
      cursor: -1,
    },
  },
  Label: { node: createBaseComponent<LabelProps>('label') },
  Picker: {
    node: createBaseComponent<PickerProps>('picker'),
    defaultProps: {
      mode: 'selector',
      disabled: false,
    },
  },
  PickerView: { node: createBaseComponent<PickerViewProps>('picker-view') },
  PickerViewColumn: { node: createBaseComponent<PickerViewColumnProps>('picker-view-column') },
  Radio: {
    node: createBaseComponent<RadioProps>('radio'),
    defaultProps: {
      checked: false,
      disabled: false,
      color: '#F85959',
    },
  },
  RadioGroup: { node: createBaseComponent<RadioGroupProps>('radio-group') },
  Slider: {
    node: createBaseComponent<SliderProps>('slider'),
    defaultProps: {
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      value: 0,
      color: '#e9e9e9',
      selectedColor: '#1aad19',
      activeColor: '#1aad19',
      backgroundColor: '#e9e9e9',
      blockSize: 28,
      blockColor: '#ffffff',
      showValue: false,
    },
  },
  Switch: {
    node: createBaseComponent<SwitchProps>('switch'),
    defaultProps: {
      checked: false,
      disabled: false,
      type: 'switch',
      color: '#F85959',
    },
  },
  Textarea: {
    node: createBaseComponent<TextareaProps>('textarea'),
    defaultProps: {
      disabled: false,
      maxLength: 140,
      focus: false,
      autoHeight: false,
      fixed: false,
      cursorSpacing: 0,
      cursor: -1,
      selectionStart: -1,
      selectionEnd: -1,
    },
  },
  Navigator: {
    node: createBaseComponent<NavigatorProps>('ttnavigator'),
    defaultProps: {
      openType: 'navigate',
      hoverClassName: 'navigator-hover',
      hoverStartTime: 50,
      hoverStayTime: 400,
      hoverStopPropagation: false,
    },
  },
  Image: {
    node: createBaseComponent<ImageProps>('image'),
    defaultProps: {
      mode: 'scaleToFill',
      lazyLoad: false,
    },
  },
  Video: {
    node: createBaseComponent<VideoProps>('video'),
    defaultProps: {
      autoplay: false,
      loop: false,
      showFullscreenBtn: true,
      showPlayBtn: true,
      controls: true,
      objectFit: 'contain',
      playBtnPosition: 'center',
    },
  },
  LivePlayer: { node: createBaseComponent<LivePlayerProps>('live-player') },
  Camera: { node: createBaseComponent<CameraProps>('camera') },
  Canvas: { node: createBaseComponent<CanvasProps>('canvas') },
  Map: { node: createBaseComponent<MapProps>('map') },
  Webview: {
    node: createBaseComponent<WebviewProps>('web-view'),
    defaultProps: {
      progressBarColor: '#51a0d8',
    },
  },
  Ad: { node: createBaseComponent<AdProps>('ad') },
  OpenData: { node: createBaseComponent<OpenDataProps>('open-data') },
  // 自定义
  Link: {
    node: (function createBaseComponent(name) {
      const Component = React.forwardRef(({ children, to }, ref) =>
        React.createElement(name, { url: to, ref }, children),
      );
      Component.displayName = name;
      return Component;
    })('ttnavigator') as React.ComponentType<LinkProps>,
  },
};

class MiniComponents extends BaseComponents {
  constructor() {
    for (const i in componentsMap) {
      const item = componentsMap[i];
      if (item.defaultProps) {
        item.node.defaultProps = item.defaultProps;
      }
      this[i] = item.node;
    }
  }
}
export default MiniComponents;
