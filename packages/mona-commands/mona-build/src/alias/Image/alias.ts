import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { ImageAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  src: propAliasMap.src,
  mode: propAliasMap.mode,
  lazyLoad: propAliasMap.lazyLoad,
  onError: propAliasMap.onError,
  onLoad: propAliasMap.onLoad,
};

export default alias;
