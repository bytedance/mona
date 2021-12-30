import { transformNodeName } from '../../utils/reactNode';
import { ComponentType } from '@bytedance/mona-shared';
test('transformNodeName', () => {
  const pickerViewAlias = ComponentType['picker-view'];
  expect(transformNodeName('PickerView')).toBe(pickerViewAlias);
  expect(transformNodeName('picker-view')).toBe(pickerViewAlias);
  expect(transformNodeName('view')).toBe(ComponentType['view']);
  expect(transformNodeName('View')).toBe(ComponentType['view']);

  expect(transformNodeName(ComponentType['picker-view'])).toBe(pickerViewAlias);
  expect(transformNodeName('随便一个字符串')).toBe(undefined);
  expect(transformNodeName('Webview')).toBe(ComponentType['web-view']);
});
