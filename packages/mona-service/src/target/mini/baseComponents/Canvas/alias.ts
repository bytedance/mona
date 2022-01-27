import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { CanvasAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  canvasId: propAliasMap.canvasId,
  type: propAliasMap.type,
};

export default alias;
