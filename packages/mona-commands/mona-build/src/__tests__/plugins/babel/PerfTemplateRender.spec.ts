import * as babel from '@babel/core';

import monaStore from '../../../store';
import perfTemplateRender from '../../../plugins/babel/PerfTemplateRender';
import compressNodeTypePlugin from '../../../plugins/babel/CompressNodeType';
import { ComponentType } from '@bytedance/mona-shared';
function jsxTransform(source: string, filename: string = __filename) {
  return new Promise<string>((resolve, reject) => {
    babel.transform(
      source,
      {
        plugins: ['@babel/plugin-syntax-jsx', compressNodeTypePlugin, perfTemplateRender],
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
});
