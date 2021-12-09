import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { WebviewAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  src: propAliasMap.src,
  progressBarColor: propAliasMap.progressBarColor,
  onMessage: propAliasMap.onMessage,
  onLoad: propAliasMap.onLoad,
  onError: propAliasMap.onError,
};

export default alias;
