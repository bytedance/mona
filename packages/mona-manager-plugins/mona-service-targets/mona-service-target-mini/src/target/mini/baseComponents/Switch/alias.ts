import { bubbleEventsAlias, basePropAlias,  propAliasMap } from '../prop';
import { SwitchAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  name: propAliasMap.name,
  checked: propAliasMap.checked,
  disabled: propAliasMap.disabled,
  type: propAliasMap.type,
  color: propAliasMap.color,
  onChange: propAliasMap.onChange,
};

export default alias;
