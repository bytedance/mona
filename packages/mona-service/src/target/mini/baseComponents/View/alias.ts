import { bubbleEventsAlias, hoverPropAlias, basePropAlias } from '../prop';
import { ViewAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...hoverPropAlias,
  ...bubbleEventsAlias,
  //@ts-ignore
  slot: 'slot',
};

export default alias;
