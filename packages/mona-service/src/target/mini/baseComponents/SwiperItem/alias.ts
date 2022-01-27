import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { SwiperItemAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  itemId: propAliasMap.itemId,
};

export default alias;
