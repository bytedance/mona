import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { PickerViewAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  value: propAliasMap.value,
  indicatorStyle: propAliasMap.indicatorStyle,
  maskStyle: propAliasMap.maskStyle,
  onChange: propAliasMap.onChange,
};

export default alias;
