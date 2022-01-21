import { askConfig, ask, AskOpts } from '../../utils/ask';

describe('ask', () => {
  test('ask use default value', async () => {
    const params = Object.keys(askConfig).reduce<AskOpts>((res, item) => {
      const askItemConfig = askConfig[item];
      res[item] = askItemConfig?.testDefault || askItemConfig.default;
      return res;
    }, <AskOpts>{});
    await ask(params);
  }, 10000);
});
