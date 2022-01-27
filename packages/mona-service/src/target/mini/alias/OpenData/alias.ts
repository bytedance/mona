import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { OpenDataAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  defaultAvatar: propAliasMap.defaultAvatar,
  defaultText: propAliasMap.defaultText,
  type: propAliasMap.type,
  useEmptyValue: propAliasMap.useEmptyValue,
  onError: propAliasMap.onError,
};

export default alias;
