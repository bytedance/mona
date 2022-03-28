Component({
  data: {
    name: 'custom',
  },
  properties: {
    myProperty: {
      // 类型（必填），目前可使用的类型包括：String, Number, Boolean, Object, Array, null（表示 any 类型）
      type: String,

      // 属性的默认值 (可选), 如果没有特别指定，会根据类型指定一个默认值
      value: '66666',
     
    },
  },
});
