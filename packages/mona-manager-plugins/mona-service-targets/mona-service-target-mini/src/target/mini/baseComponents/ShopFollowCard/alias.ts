import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { ShopFollowCardAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  shopId: propAliasMap.shopId,
  onFollowed: propAliasMap['bind:followed'],
  onUnfollowed: propAliasMap['bind:unfollowed'],
  onError: propAliasMap.onError,
};

export default alias;
