import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { RichTextAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  nodes: propAliasMap.nodes,
};

export default alias;
