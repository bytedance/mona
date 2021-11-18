
// 只针对jest，不应影响代码构建
module.exports = {

  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],

};