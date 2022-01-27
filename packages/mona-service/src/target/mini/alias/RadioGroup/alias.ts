import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { RadioGroupAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  name: propAliasMap.name,
  onChange: propAliasMap.onChange,
};

export default alias;
