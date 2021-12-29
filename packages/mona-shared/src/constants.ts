export const RENDER_NODE = {
  COMPLIER_KEY: 'k',
  COMPLIER_TYPE: 't',
  COMPLIER_NODES: 'n',
  COMPLIER_CHILDREN: 'c',
  COMPLIER_TEXT: 'x',
  COMPLIER_PROPS: 'p',
};
export const ComponentType = {
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
  // ptext的值不要随意改变, 改ptext需将base.ttml.ejs中 mona-36中的36做替换
  ptext: '36',
};

export const ComponentAliasMap = Object.keys(ComponentType).reduce((pre: Record<string, string>, item) => {
  //@ts-ignore
  pre[ComponentType[item]] = item;
  return pre;
}, {});
