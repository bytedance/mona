/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { RENDER_NODE } from '@bytedance/mona-shared';

import baseConfig from '../../../jestconfig.base';

module.exports = {
  ...baseConfig,

  globals: Object.keys(RENDER_NODE).reduce(
    (pre, item) => {
      pre[`${item}_STR`] = JSON.stringify(RENDER_NODE[item]);
      return pre;
    },
    {
      ...RENDER_NODE,
      ...baseConfig.globals,
    },
  ),
};
