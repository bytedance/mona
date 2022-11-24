import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { MemberButtonAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  shopId: propAliasMap.shopId,
  'bind:cancel': propAliasMap['bind:cancel'],
  'bind:error': propAliasMap['bind:error'],
  'bind:success': propAliasMap['bind:success'],
};

export default alias;
