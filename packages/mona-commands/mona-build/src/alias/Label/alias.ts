import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { LabelAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  for: propAliasMap.for,
};

export default alias;
