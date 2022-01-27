import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { SwiperAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  indicatorDots: propAliasMap.indicatorDots,
  indicatorColor: propAliasMap.indicatorColor,
  indicatorActiveColor: propAliasMap.indicatorActiveColor,
  autoplay: propAliasMap.autoplay,
  current: propAliasMap.current,
  currentItemId: propAliasMap.currentItemId,
  interval: propAliasMap.interval,
  previousMargin: propAliasMap.previousMargin,
  nextMargin: propAliasMap.nextMargin,
  displayMultipleItems: propAliasMap.displayMultipleItems,
  duration: propAliasMap.duration,
  circular: propAliasMap.circular,
  vertical: propAliasMap.vertical,
  onChange: propAliasMap.onChange,
  onAnimationFinish: propAliasMap.onAnimationFinish,
  onTransition: propAliasMap.onTransition,
};

export default alias;
