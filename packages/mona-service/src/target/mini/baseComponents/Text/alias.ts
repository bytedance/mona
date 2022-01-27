import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { TextAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  selectable: propAliasMap.selectable,
  space: propAliasMap.space,
  decode: propAliasMap.decode,
};

export default alias;
