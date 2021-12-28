import view from './View/alias';
import button from './Button/alias';
import checkbox from './Checkbox/alias';
import checkboxGroup from './CheckboxGroup/alias';
import form from './Form/alias';
import input from './Input/alias';
import label from './Label/alias';
import scrollView from './ScrollView/alias';
import slider from './Slider/alias';
import switchComponent from './Switch/alias';
import textArea from './TextArea/alias';
import text from './Text/alias';
import icon from './Icon/alias';
import movableArea from './MovableArea/alias';
import movableView from './MovableView/alias';
import picker from './Picker/alias';
import pickerView from './PickerView/alias';
import pickerViewColumn from './PickerViewColumn/alias';
import progress from './Progress/alias';
import radio from './Radio/alias';
import radioGroup from './RadioGroup/alias';
import richText from './RichText/alias';
import swiper from './Swiper/alias';
import swiperItem from './SwiperItem/alias';
import block from './Block/alias';
import navigator from './Navigator/alias';
import ad from './Ad/alias';
import canvas from './Canvas/alias';
import image from './Image/alias';
import livePlayer from './LivePlayer/alias';
import openData from './OpenData/alias';
import video from './Video/alias';
import webview from './Webview/alias';
import map from './Map/alias';
// import map from './Ca/alias';
// import * as Components from '@bytedance/mona-components';
import { ComponentType } from '@bytedance/mona-shared';
type ComponentName = any;
export const ejsParamsObj: Record<
  string,
  {
    reactComponentName: ComponentName | 'Block';
    alias: any;
    defaultProps?: Record<string, string | boolean | number>;
  }
> = {
  [ComponentType.text]: {
    reactComponentName: 'Text',
    alias: text,
    defaultProps: { selectable: false, space: false, decode: false },
  },
  [ComponentType.block]: {
    reactComponentName: 'Block',
    alias: block,
  },
  [ComponentType['rich-text']]: { reactComponentName: 'RichText', alias: richText },
  [ComponentType.progress]: {
    reactComponentName: 'Progress',
    alias: progress,
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
  [ComponentType.icon]: {
    reactComponentName: 'Icon',
    alias: icon,
    defaultProps: {
      size: 24,
    },
  },
  [ComponentType.view]: {
    reactComponentName: 'View',
    alias: view,
    defaultProps: {
      hoverClassName: 'none',
      hoverStartTime: 50,
      hoverStayTime: 400,
      hoverStopPropagation: false,
    },
  },
  [ComponentType['scroll-view']]: {
    reactComponentName: 'ScrollView',
    alias: scrollView,
    defaultProps: {
      scrollX: false,
      scrollY: false,
      upperThreshold: 50,
      lowerThreshold: 50,
      scrollWithAnimation: false,
    },
  },
  [ComponentType.swiper]: {
    reactComponentName: 'Swiper',
    alias: swiper,
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
  [ComponentType['swiper-item']]: {
    reactComponentName: 'SwiperItem',
    alias: swiperItem,
  },
  'movable-area': {
    reactComponentName: 'MovableArea',

    alias: movableArea,
  },
  [ComponentType['movable-view']]: {
    reactComponentName: 'MovableView',
    alias: movableView,
  },
  [ComponentType.button]: {
    reactComponentName: 'Button',

    alias: button,

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
  [ComponentType.checkbox]: {
    reactComponentName: 'Checkbox',
    alias: checkbox,
    defaultProps: {
      disabled: false,
      checked: false,
    },
  },
  [ComponentType['checkbox-group']]: {
    reactComponentName: 'CheckboxGroup',

    alias: checkboxGroup,
  },
  [ComponentType.form]: {
    reactComponentName: 'Form',

    alias: form,

    defaultProps: {
      reportSubmit: false,
    },
  },
  [ComponentType.input]: {
    reactComponentName: 'Input',

    alias: input,

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
  [ComponentType.label]: {
    reactComponentName: 'Label',
    alias: label,
  },
  [ComponentType.picker]: {
    reactComponentName: 'Picker',
    alias: picker,
    defaultProps: {
      mode: 'selector',
      disabled: false,
    },
  },
  [ComponentType['picker-view']]: {
    reactComponentName: 'PickerView',

    alias: pickerView,
  },
  [ComponentType['picker-view-column']]: {
    reactComponentName: 'PickerViewColumn',

    alias: pickerViewColumn,
  },
  [ComponentType.radio]: {
    reactComponentName: 'Radio',
    alias: radio,
    defaultProps: {
      checked: false,
      disabled: false,
      color: '#F85959',
    },
  },
  [ComponentType['radio-group']]: {
    reactComponentName: 'RadioGroup',

    alias: radioGroup,
  },
  [ComponentType.slider]: {
    reactComponentName: 'Slider',

    alias: slider,

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
  [ComponentType.switch]: {
    reactComponentName: 'Switch',
    alias: switchComponent,
    defaultProps: {
      checked: false,
      disabled: false,
      type: 'switch',
      color: '#F85959',
    },
  },
  [ComponentType.textarea]: {
    reactComponentName: 'Textarea',

    alias: textArea,

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
  [ComponentType.navigator]: {
    reactComponentName: 'Navigator',
    alias: navigator,
    defaultProps: {
      openType: 'navigate',
      hoverClassName: 'navigator-hover',
      hoverStartTime: 50,
      hoverStayTime: 400,
      hoverStopPropagation: false,
    },
  },
  [ComponentType.image]: {
    reactComponentName: 'Image',

    alias: image,

    defaultProps: {
      mode: 'scaleToFill',
      lazyLoad: false,
    },
  },
  [ComponentType.video]: {
    alias: video,
    reactComponentName: 'Video',

    defaultProps: {
      autoplay: false,
      loop: false,
      showFullscreenBtn: true,
      showPlayBtn: true,
      controls: true,
      objectFit: 'contain',
      playBtnPosition: 'center',
      vslideGesture: false,
      vslideGestureInFullscreen: false,
      muted: false,
      showMuteBtn: false,
      showPlayInBackground: false,
      direction: -90,
      enablePlayInBackground: false,
    },
  },
  [ComponentType['live-player']]: {
    reactComponentName: 'LivePlayer',

    alias: livePlayer,
    defaultProps: {
      autoplay: false,
      muted: false,
      orientation: 'vertical',
      objectFit: 'contain',
    },
  },
  // camera: {
  //   alias: camera,
  // },
  [ComponentType.canvas]: {
    reactComponentName: 'Canvas',

    alias: canvas,
  },
  [ComponentType.map]: {
    reactComponentName: 'Map',

    alias: map,
  },
  [ComponentType['web-view']]: {
    reactComponentName: 'Webview',

    alias: webview,

    defaultProps: {
      progressBarColor: '#51a0d8',
    },
  },
  [ComponentType.ad]: {
    reactComponentName: 'Ad',
    alias: ad,
  },
  [ComponentType['open-data']]: {
    reactComponentName: 'OpenData',
    alias: openData,
  },
};

const baseDefaultProps: Record<string, string | number | boolean> = {
  className: '',
};

export const genEjsParamsMap = () => {
  const ejsParamsMap = new Map();
  for (let name in ejsParamsObj) {
    let defaultProps = ejsParamsObj[name].defaultProps || {};

    defaultProps = { ...baseDefaultProps, ...defaultProps };
    for (let prop in defaultProps) {
      if (typeof defaultProps[prop] === 'string') {
        defaultProps[prop] = `'${defaultProps[prop]}'`;
      }
    }

    ejsParamsMap.set(name, { ...ejsParamsObj[name], defaultProps });
  }

  return ejsParamsMap;
};
