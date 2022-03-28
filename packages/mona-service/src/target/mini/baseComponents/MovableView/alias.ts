import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { MovableViewAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  direction: propAliasMap.direction,
  inertia: propAliasMap.inertia,
  outOfBounds: propAliasMap.outOfBounds,
  x: propAliasMap.x,
  y: propAliasMap.y,
  damping: propAliasMap.damping,
  friction: propAliasMap.friction,
  disabled: propAliasMap.disabled,
  scale: propAliasMap.scale,
  scaleMin: propAliasMap.scaleMin,
  scaleMax: propAliasMap.scaleMax,
  scaleValue: propAliasMap.scaleValue,
  animation: propAliasMap.animation,
  onChange: propAliasMap.onChange,
  onHtouchMove: propAliasMap.onHtouchMove,
  onScale: propAliasMap.onScale,
  onVtouchMove: propAliasMap.onVtouchMove,
};

export default alias;
