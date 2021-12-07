import { bubbleEventsAlias, basePropAlias, baseComponentPropsMap as aliasMap } from '../prop';
import { ScrollViewAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  scrollX: aliasMap.scrollX,
  scrollY: aliasMap.scrollY,
  scrollIntoView: aliasMap.scrollIntoView,
  scrollWithAnimation: aliasMap.scrollWithAnimation,
  scrollLeft: aliasMap.scrollLeft,
  scrollTop: aliasMap.scrollTop,
  upperThreshold: aliasMap.upperThreshold,
  lowerThreshold: aliasMap.lowerThreshold,
  onScroll: aliasMap.onScroll,
  onScrollToLower: aliasMap.onScrollToLower,
  onScrollToUpper: aliasMap.onScrollToUpper,
};

export default alias;
