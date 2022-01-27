import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { CheckboxAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  disabled: propAliasMap.disabled,
  checked: propAliasMap.checked,
  color: propAliasMap.color,
  value: propAliasMap.value,
};

export default alias;
