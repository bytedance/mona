import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { CheckboxGroupAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  onChange: propAliasMap.disabled,
  name: propAliasMap.name,
};

export default alias;
