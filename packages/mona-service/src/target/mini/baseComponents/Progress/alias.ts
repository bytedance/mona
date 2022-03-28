import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { ProgressAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  percent: propAliasMap.percent,
  strokeWidth: propAliasMap.strokeWidth,
  color: propAliasMap.color,
  activeColor: propAliasMap.activeColor,
  backgroundColor: propAliasMap.backgroundColor,
  active: propAliasMap.active,
  activeMode: propAliasMap.activeMode,
};

export default alias;
