export const RENDER_NODE = {
  COMPLIER_KEY: 'k',
  COMPLIER_TYPE: 't',
  COMPLIER_NODES: 'n',
  COMPLIER_CHILDREN: 'c',
  COMPLIER_TEXT: 'x',
  COMPLIER_PROPS: 'p',
};

const MiniComponentType = {
  text: '1',
  block: '2',
  'rich-text': '3',
  progress: '4',
  icon: '5',
  view: '6',
  'scroll-view': '7',
  swiper: '8',
  'swiper-item': '9',
  'movable-area': '10',
  'movable-view': '11',
  button: '12',
  checkbox: '13',
  'checkbox-group': '14',
  form: '15',
  input: '16',
  label: '17',
  picker: '18',
  'picker-view': '19',
  'picker-view-column': '20',
  radio: '21',
  'radio-group': '22',
  slider: '23',
  switch: '24',
  textarea: '25',
  navigator: '26',
  image: '27',
  video: '28',
  'live-player': '29',
  camera: '30',
  canvas: '31',
  map: '32',
  'web-view': '33',
  ad: '34',
  'open-data': '35',
  ptext: '36',
  'member-button': '37',
};

// TODO:开发模式语义化, 小程序运行时 build两份代码, index.production.js, index.development.js
// if (process.env.NODE_ENV === 'production') {
//   RENDER_NODE = {
//     COMPLIER_KEY: 'key',
//     COMPLIER_TYPE: 'type',
//     COMPLIER_NODES: 'nodes',
//     COMPLIER_CHILDREN: 'children',
//     COMPLIER_TEXT: 'text',
//     COMPLIER_PROPS: 'props',
//   };
//   for (const k in MiniComponentType) {
//     MiniComponentType[k as keyof typeof MiniComponentType] = k;
//   }
// }

export const webComponentType = {
  span: MiniComponentType.text,
  div: MiniComponentType.view,
  section: MiniComponentType.view,
  article: MiniComponentType.view,
  aside: MiniComponentType.view,
  footer: MiniComponentType.view,
  address: MiniComponentType.view,
  main: MiniComponentType.view,
  nav: MiniComponentType.view,
  code: MiniComponentType.view,

  img: MiniComponentType.image,
  iframe: MiniComponentType['web-view'],
};
export const ComponentType = { ...webComponentType, ...MiniComponentType };

export const MiniComponentAliasMap = Object.keys(MiniComponentType).reduce((pre: Record<string, string>, item) => {
  pre[MiniComponentType[item as keyof typeof MiniComponentType]] = item;
  return pre;
}, {});

export const CUSTOM_REF = '__ref';

export const CUSTOM_COMPONENT_PROTOCOL = 'native://';

export const GLOBAL_LIFECYCLE_STORE = '_mona_app_lifecycle';
export const DEFAULT_PORT = '9999';
export const DEFAULT_HOST = 'localhost';
