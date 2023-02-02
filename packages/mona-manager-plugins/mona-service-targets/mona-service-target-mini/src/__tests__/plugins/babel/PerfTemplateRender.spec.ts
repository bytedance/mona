import monaStore from '../../../target/store';
import perfTemplateRender from '../../../plugins/babel/PerfTemplateRender';
import TransformJsxNamePlugin from '../../../plugins/babel/TransformJsxName';
import { ComponentType } from '@bytedance/mona-shared';
import runtimePkgJson from '@bytedance/mona-runtime/package.json';

function jsxTransform(source: string, filename: string = __filename) {
  return new Promise<string>((resolve, reject) => {
    require('@babel/core').transform(
      source,
      {
        plugins: ['@babel/plugin-transform-react-jsx', TransformJsxNamePlugin, perfTemplateRender],
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

const templateCollectCode = `
import React from 'react';

()=>( <>
  <view></view>
  <div></div>
  <这是哪个标签></这是哪个标签>
  <picker></picker>
  <picker-view></picker-view>

  <img></img>
</>)
`;
const propsCollectCode = `
import {View} from "${runtimePkgJson.name}";
import React from 'react';
()=>( <>
  <view onTap={()=>{}} ></view>
  <div onTouchMove={()=>{}} ></div>
  <View class="1" ></View>

  <picker disabled  我不知道这是一个什么属性={1} ></picker>
  <picker-view {...props}></picker-view>
  <picker-view-column></picker-view-column>

  <img range={[1,2]} src="https://dontInvolution.bytedance.com" ></img>
</>)
`;
const importCode = `
import { View } from "${runtimePkgJson.name}"
import { PickerView } from "other"
import React from 'react';


()=>( <>
  <view onTap={()=>{}} ></view>
  <div onTouchMove={()=>{}} ></div>
  <View class="1" ></View>
  <text space="ensp">1234</text>
  <Text selectable={true}>123</Text>
  <PickerView></PickerView>
</>)
`;
describe('perfTemplateRender', () => {
  beforeEach(() => {
    monaStore.templateRenderMap.clear();
  });
  afterAll(() => {
    monaStore.templateRenderMap.clear();
  });

  it('collect Template', async () => {
    await jsxTransform(templateCollectCode, 'templateCollectCode.tsx');
    expect(Array.from(monaStore.templateRenderMap.keys()).length === 4).toBeTruthy();
  });

  it('collect Props', async () => {
    await jsxTransform(propsCollectCode, 'propsCollectCode.tsx');
    const viewInfo = monaStore.templateRenderMap.get(ComponentType.view);
    const pickerInfo = monaStore.templateRenderMap.get(ComponentType.picker);
    const pickerViewInfo = monaStore.templateRenderMap.get(ComponentType['picker-view']);
    const pickerViewColumnInfo = monaStore.templateRenderMap.get(ComponentType['picker-view-column']);
    const imageInfo = monaStore.templateRenderMap.get(ComponentType.image);
    expect([viewInfo.isRenderAllProps, Object.keys(viewInfo.renderProps).length]).toEqual([false, 3]);
    expect([pickerInfo.isRenderAllProps, Object.keys(pickerInfo.renderProps).length]).toEqual([false, 1]);
    expect(pickerViewInfo.isRenderAllProps).toBeTruthy();
    expect([pickerViewColumnInfo.isRenderAllProps, Object.keys(pickerViewColumnInfo.renderProps).length]).toEqual([
      false,
      0,
    ]);
    expect([imageInfo.isRenderAllProps, Object.keys(imageInfo.renderProps).length]).toEqual([false, 1]);
  });
  // 测试非 @bytedance/mona-runtime 导入的同名组件是否会记录
  it('collect Props', async () => {
    await jsxTransform(importCode, 'importCode.tsx');
    const viewInfo = monaStore.templateRenderMap.get(ComponentType.view);
    const pickerViewInfo = monaStore.templateRenderMap.get(ComponentType['picker-view']);
    const textInfo = monaStore.templateRenderMap.get(ComponentType['text']);
    expect([viewInfo.isRenderAllProps, Object.keys(viewInfo.renderProps).length]).toEqual([false, 3]);
    expect([
      textInfo.isRenderAllProps,
      textInfo.renderProps['space'],
      Object.keys(textInfo.renderProps).length,
    ]).toEqual([false, true, 1]);

    expect(pickerViewInfo).toBeUndefined();
  });
});
