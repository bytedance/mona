import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { RadioAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  value: propAliasMap.value,
  checked: propAliasMap.checked,
  disabled: propAliasMap.disabled,
  color: propAliasMap.color,
};

export default alias;
