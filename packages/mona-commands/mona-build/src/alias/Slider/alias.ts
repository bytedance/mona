import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { SliderAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  min: propAliasMap.min,
  max: propAliasMap.max,
  step: propAliasMap.step,
  disabled: propAliasMap.disabled,
  value: propAliasMap.value,
  color: propAliasMap.color,
  selectedColor: propAliasMap.selectedColor,
  activeColor: propAliasMap.activeColor,
  backgroundColor: propAliasMap.backgroundColor,
  blockColor: propAliasMap.blockColor,
  showValue: propAliasMap.showValue,
  onChange: propAliasMap.onChange,
  onChanging: propAliasMap.onChanging,
  blockSize: propAliasMap.blockSize,
};

export default alias;
