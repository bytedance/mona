import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { CameraAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  resolution: propAliasMap.resolution,
  devicePosition: propAliasMap.devicePosition,
  flash: propAliasMap.flash,
  frameSize: propAliasMap.frameSize,
  onInitDone: propAliasMap.onInitDone,
  onError: propAliasMap.onError,
  onStop: propAliasMap.onStop,
  onScanCode: propAliasMap.onScanCode,
  mode: propAliasMap.mode,
};

export default alias;
