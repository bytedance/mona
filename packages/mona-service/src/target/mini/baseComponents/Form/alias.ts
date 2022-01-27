import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { FormAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  onSubmit: propAliasMap.onSubmit,
  onReset: propAliasMap.onReset,
};

export default alias;
