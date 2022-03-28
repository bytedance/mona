import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { MovableAreaAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  scaleArea: propAliasMap.scaleArea,
};

export default alias;
