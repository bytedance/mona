import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { ProductFollowButtonAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  shopId: propAliasMap.shopId,
  productId: propAliasMap.productId,
  disabled: propAliasMap.disabled,
  noStyle: propAliasMap.noStyle,
  size: propAliasMap.size,
  disabledClassName: propAliasMap.disabledClassName,
  followedClassName: propAliasMap.followedClassName,
  followedText: propAliasMap.followedText,
  unfollowedClassName: propAliasMap.unfollowedClassName,
  unfollowedText: propAliasMap.unfollowedText,
  onFollowed: propAliasMap['bind:followed'],
  onUnfollowed: propAliasMap['bind:unfollowed'],
  onError: propAliasMap.onError,
};

export default alias;
