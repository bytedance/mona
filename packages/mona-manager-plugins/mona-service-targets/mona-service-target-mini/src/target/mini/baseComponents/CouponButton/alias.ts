import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { CouponButtonAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  shopId: propAliasMap.shopId,
  couponId: propAliasMap.couponId,
  buttonText: propAliasMap.buttonText,
  modalOptions: propAliasMap.modalOptions,
  url: propAliasMap.url,
  activeBackgroundColor: propAliasMap.activeBackgroundColor,
  activeColor: 'activeColor',
  disableBackgroundColor: propAliasMap.disableBackgroundColor,
  disableColor: propAliasMap.disableColor,
};

export default alias;
