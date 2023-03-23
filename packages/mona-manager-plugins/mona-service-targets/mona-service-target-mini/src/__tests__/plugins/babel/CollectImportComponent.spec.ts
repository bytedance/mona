import monaStore from '../../../target/store';
import CollectImportComponent from '../../../plugins/babel/CollectImportComponent';
import { CUSTOM_COMPONENT_PROTOCOL } from '@bytedance/mona-shared';

const { nativeEntryMap } = monaStore;
function jsxTransform(source: string, filename: string = __filename) {
  return new Promise<string>((resolve, reject) => {
    require('@babel/core').transform(
      source,
      {
        plugins: [CollectImportComponent],
        presets: [[require.resolve('@babel/preset-react')]],
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
import CustomComponent from "${CUSTOM_COMPONENT_PROTOCOL}./dd"
import MyComponent from "${CUSTOM_COMPONENT_PROTOCOL}./aa"

import React from "react"
import { View } from "@bytedance/mona-runtime"

export default () => {
  return (
    <View>
      <View> 非常棒 </View>
      <CustomComponent a={1}  b={2}></CustomComponent>
    </View>
  )
}
`;

describe('CollectImportComponent', () => {
  beforeEach(() => {
    monaStore.nativeEntryMap.clear();
  });
  afterAll(() => {
    monaStore.nativeEntryMap.clear();
  });

  it('getJsxProps', async () => {
    await jsxTransform(templateCollectCode, 'templateCollectCode.tsx');

    expect(Array.from(nativeEntryMap.keys()).length).toBe(1);
    const entry = nativeEntryMap.get(Array.from(nativeEntryMap.keys())[0])!;
    // entry.templateInfo;
    const { props, componentName } = entry.templateInfo;
    expect(componentName).toBe('custom-component');
    expect(Array.from(props.values())).toEqual(['a', 'b']);
  });
});
