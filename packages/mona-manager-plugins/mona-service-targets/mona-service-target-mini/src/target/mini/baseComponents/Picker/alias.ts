import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { PickerAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  name: propAliasMap.name,
  mode: propAliasMap.mode,
  value: propAliasMap.value,
  disabled: propAliasMap.disabled,
  onCancel: propAliasMap.onCancel,
  range: propAliasMap.range,
  rangeKey: propAliasMap.rangeKey,
  start: propAliasMap.start,
  end: propAliasMap.end,
  fields: propAliasMap.fields,
  customItem: propAliasMap.customItem,
  onChange: propAliasMap.onChange,
  onColumnChange: propAliasMap.onColumnChange,
};

export default alias;
