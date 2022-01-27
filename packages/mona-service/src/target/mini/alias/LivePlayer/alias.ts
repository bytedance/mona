import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { LivePlayerAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  src: propAliasMap.src,
  muted: propAliasMap.muted,
  autoplay: propAliasMap.autoplay,
  orientation: propAliasMap.orientation,
  objectFit: propAliasMap.objectFit,
  onFullscreenChange: propAliasMap.onFullscreenChange,
  onStateChange: propAliasMap.onStateChange,
  onError: propAliasMap.onError,
};

export default alias;
