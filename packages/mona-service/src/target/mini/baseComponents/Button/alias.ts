import { bubbleEventsAlias, hoverPropAlias, basePropAlias, propAliasMap } from '../prop';
import { ButtonAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  size: propAliasMap.size,
  loading: propAliasMap.loading,
  type: propAliasMap.type,
  formType: propAliasMap.formType,
  disabled: propAliasMap.disabled,
  openType: propAliasMap.openType,
  onGetPhoneNumber: propAliasMap.onGetPhoneNumber,
};

export default alias;
