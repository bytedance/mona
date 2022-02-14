/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { RENDER_NODE, ComponentType } from '@bytedance/mona-shared';

import baseConfig from '../../../jestconfig.base';

module.exports = {
  ...baseConfig,

  globals: Object.keys(RENDER_NODE).reduce(
    (pre, item) => {
      //@ts-ignore
      pre[`${item}_STR`] = JSON.stringify(RENDER_NODE[item]);
      return pre;
    },
    {
      ...RENDER_NODE,
      NAVIGATE_ALIAS: JSON.stringify(ComponentType.navigator),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      ...baseConfig.globals,
    },
  ),
};
