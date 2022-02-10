import { TtComponentEntry } from '../../../target/entires/ttComponentEntry';
import { TtPageEntry } from '../../../target/entires/ttPageEntry';

import ConfigHelper from '../../../ConfigHelper';
import * as shared from '@bytedance/mona-shared';
import fs from 'fs';
import path from 'path';
import monaStore from '../../../target/store';

describe('TtPageEntry', () => {
  jest.spyOn(shared, 'readConfig').mockImplementation(() => ({}));
  jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
  const configHelperIns = new ConfigHelper();
  jest.restoreAllMocks();
  configHelperIns.cwd = __dirname;
  const entryPath = path.join(__dirname, './src/CustomComponent/index');
  let TtEntry = new TtPageEntry(configHelperIns, entryPath);
  it('isNative', () => {
    expect(TtPageEntry.isNative(TtEntry.entry)).toBeTruthy();
  });
});
