import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { SkuButtonAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  shopId: propAliasMap.shopId,
  productId: propAliasMap.productId,
  actionType: propAliasMap.actionType,
  disabled: propAliasMap.disabled,
  noStyle: propAliasMap.noStyle,
  size: propAliasMap.size,
  type: propAliasMap.type,
  disabledClassName: propAliasMap.disabledClassName,
  text: propAliasMap.text,
  onSuccess: propAliasMap['bind:success'],
  onError: propAliasMap.onError,
};

export default alias;
