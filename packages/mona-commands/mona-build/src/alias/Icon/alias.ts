import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { IconAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  size: propAliasMap.size,
  color: propAliasMap.loading,
  type: propAliasMap.type,
};

export default alias;
