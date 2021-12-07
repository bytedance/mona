import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { ScrollViewAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  scrollX: propAliasMap.scrollX,
  scrollY: propAliasMap.scrollY,
  scrollIntoView: propAliasMap.scrollIntoView,
  scrollWithAnimation: propAliasMap.scrollWithAnimation,
  scrollLeft: propAliasMap.scrollLeft,
  scrollTop: propAliasMap.scrollTop,
  upperThreshold: propAliasMap.upperThreshold,
  lowerThreshold: propAliasMap.lowerThreshold,
  onScroll: propAliasMap.onScroll,
  onScrollToLower: propAliasMap.onScrollToLower,
  onScrollToUpper: propAliasMap.onScrollToUpper,
};

export default alias;
