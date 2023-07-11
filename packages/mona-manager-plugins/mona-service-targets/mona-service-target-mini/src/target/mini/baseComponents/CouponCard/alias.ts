import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { CouponCardAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  shopId: propAliasMap.shopId,
  couponId: propAliasMap.couponId,
  isShowButtonOnly: propAliasMap.isShowButtonOnly,
  title: propAliasMap.title,
  subTitle: propAliasMap.subTitle,
  imgUrl: propAliasMap.imgUrl,
  buttonOptions: propAliasMap.buttonOptions,
  modalOptions: propAliasMap.modalOptions,
  navigateUrl: propAliasMap.navigateUrl,
  isShowCouponInfo: propAliasMap.isShowCouponInfo,
  productId: propAliasMap.productId,
};

export default alias;
