// @ts-nocheck
import React from 'react';
import { BaseComponents } from '@bytedance/mona'
import createBaseComponent from '../createBaseComponent';

class MiniComponents extends BaseComponents {
  Text = createBaseComponent('text')
  RichText = createBaseComponent('rich-text')
  Progress = createBaseComponent('progress')
  Icon = createBaseComponent('icon')
  View = createBaseComponent('view')
  ScrollView = createBaseComponent('scroll-view')
  Swiper = createBaseComponent('swiper')
  SwiperItem = createBaseComponent('swiper-item')
  MovableArea = createBaseComponent('movable-area')
  MovableView = createBaseComponent('movable-view')
  Button = createBaseComponent('button')
  Checkbox = createBaseComponent('checkbox')
  CheckboxGroup = createBaseComponent('checkbox-group')
  Form = createBaseComponent('form')
  Input = createBaseComponent('input')
  Label = createBaseComponent('label')
  Picker = createBaseComponent('picker')
  PickerView = createBaseComponent('picker-view')
  PickerViewColumn = createBaseComponent('picker-view-column')
  Radio = createBaseComponent('radio')
  RadioGroup = createBaseComponent('radio-group')
  Slider = createBaseComponent('slider')
  Switch = createBaseComponent('switch')
  Textarea = createBaseComponent('textarea')
  Navigator = createBaseComponent('navigator')
  Image = createBaseComponent('image')
  Video = createBaseComponent('video')
  LivePlayer = createBaseComponent('live-player')
  Camera = createBaseComponent('camera')
  Canvas = createBaseComponent('canvas')
  Map = createBaseComponent('map')
  Webview = createBaseComponent('web-view')
  Ad = createBaseComponent('ad')
  OpenData = createBaseComponent('open-data')
  // 自定义
  Link = (function createBaseComponent(name){
    const Component = React.forwardRef(({ children, to }, ref) => (React.createElement(name, { url: to, ref }, children)));
    Component.displayName = name;
    return Component;
  }('navigator'))
}

export default MiniComponents;