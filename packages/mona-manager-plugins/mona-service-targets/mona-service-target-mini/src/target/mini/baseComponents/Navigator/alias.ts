import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { NavigatorAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  url: propAliasMap.url,
  delta: propAliasMap.delta,
  openType: propAliasMap.openType,
};

export default alias;
