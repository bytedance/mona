import * as babel from '@babel/core';
import TransformJsxNamePlugin from '../../../plugins/babel/TransformJsxName';

function jsxTransform(source: string, filename: string = __filename) {
  return new Promise<string>((resolve, reject) => {
    babel.transform(
      source,
      {
        plugins: ['@babel/plugin-syntax-jsx', TransformJsxNamePlugin],
        filename,
      },
      (err, result) => {
        if (result && result.code) {
          return resolve(result.code);
        }
        reject(err);
      },
    );
  });
}

const domCode = `
const Test = () => {
  return( <View>
  <View>测试是否会将domElement转换为小程序压缩后element的别名</View>
  <div></div>
  <span></span>
  <iframe></iframe>
  <img></img>
</View>);
}
`;
const domLabels = ['img', 'span', 'div', 'iframe'];

const miniCode = `
import {View, Text} from '@bytedance/mona-runtime'
const Test = () => {
  return( <View>
  <Text>测试压缩element的别名</Text>
  <view></view>
  <text></text>
  <picker-view></picker-view>
  <slider></slider>
</View>);
}
`;
const miniLabels = ['view', 'picker-view', 'slider', 'text'];
const monaLabels = ['Text', 'View'];

describe('TransformJsxNamePlugin', () => {
  test('domElement', async () => {
    const res: string = await jsxTransform(domCode, 'domElement.tsx');
    const errorLabel = domLabels.filter(i => {
      return res.includes(i);
    });

    expect(errorLabel.length).toBe(0);
  });

  test('miniElement', async () => {
    const res: string = await jsxTransform(miniCode, 'domElement.tsx');
    const errorLabels = miniLabels.filter(i => {
      return res.includes(i);
    });
    const monaErrorLabels = monaLabels.filter(i => {
      return !res.includes(i);
    });
    expect(errorLabels.length).toBe(0);
    expect(monaErrorLabels.length).toBe(0);
  });
});
