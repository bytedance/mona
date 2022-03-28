import { MiniPageEntry } from '../../../target/entires/miniPageEntry';

import ConfigHelper from '../../../ConfigHelper';
import * as shared from '@bytedance/mona-shared';
import fs from 'fs';
import path from 'path';

describe('MiniPageEntry', () => {
  jest.spyOn(shared, 'readConfig').mockImplementation(() => ({}));
  jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
  const configHelperIns = new ConfigHelper();
  jest.restoreAllMocks();
  configHelperIns.cwd = __dirname;
  const entryPath = path.join(__dirname, './src/CustomComponent/index');
  let TtEntry = new MiniPageEntry(configHelperIns, entryPath);
  it('isMini', () => {
    expect(MiniPageEntry.isMini(TtEntry.entry)).toBeTruthy();
  });
});
