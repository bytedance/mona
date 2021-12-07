import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { SliderAlias as Alias } from '../type';

//@ts-ignore
const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  min: propAliasMap.size,
  max: propAliasMap.loading,
  step: propAliasMap.type,
  disabled: propAliasMap.formType,
  value: propAliasMap.disabled,
  color: propAliasMap.openType,
  selectedColor: propAliasMap.selectedColor,
  activeColor: propAliasMap.activeColor,
  backgroundColor: propAliasMap.backgroundColor,
  blockColor: propAliasMap.blockColor,
  showValue: propAliasMap.showValue,
  onChange: propAliasMap.onChange,
  onChanging: propAliasMap.onChanging,
};

export default alias;
