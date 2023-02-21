import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { AdAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  unitId: propAliasMap.unitId,
  onLoad: propAliasMap.onLoad,
  onError: propAliasMap.onError,
  onClose: propAliasMap.onClose,
  adIntervals: propAliasMap.adIntervals,
  fixed: propAliasMap.fixed,
  type: propAliasMap.type,
  scale: propAliasMap.scale,
};

export default alias;
