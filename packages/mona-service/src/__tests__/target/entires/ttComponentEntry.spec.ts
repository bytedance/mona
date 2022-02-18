import { TtComponentEntry } from '../../../target/entires/ttComponentEntry';
import { TtPageEntry } from '../../../target/entires/ttPageEntry';

import ConfigHelper from '../../../ConfigHelper';
import * as shared from '@bytedance/mona-shared';
import fs from 'fs';
import path from 'path';
import monaStore from '../../../target/store';
// jest.spyOn(shared, 'readConfig').mockImplementation(() => ({}))
describe('TtComponentEntry', () => {
  jest.spyOn(shared, 'readConfig').mockImplementation(() => ({}));
  jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
  const configHelperIns = new ConfigHelper();
  jest.restoreAllMocks();

  configHelperIns.cwd = __dirname;
  const entryPath = path.join(__dirname, './src/CustomComponent/index');

  let TtEntry = new TtPageEntry(configHelperIns, entryPath);

  it('readDependencies', () => {
    const res = TtEntry.readDependencies();
    // console.log(res);

    expect(Array.from(res.values()).length).toBe(16);
  });

  it('readConfig', () => {
    TtEntry.readConfig();
  });

  it('isNative', () => {
    TtComponentEntry.isNative(TtEntry.entry);
    expect(TtComponentEntry.isNative(TtEntry.entry)).toBeFalsy();
    expect(TtPageEntry.isNative(TtEntry.entry)).toBeTruthy();
    const custom4Entry = monaStore.nativeEntryMap.get(path.join(__dirname, './src/CustomComponent3/index'));
    expect(TtComponentEntry.isNative(custom4Entry.entry)).toBeTruthy();
  });
  it('src', () => {
    // console.log( monaStore.nativeEntryMap)
    const custom4Entry = monaStore.nativeEntryMap.get(path.join(__dirname, './src/CustomComponent3/index'));
    const custom3Entry = monaStore.nativeEntryMap.get(path.join(__dirname, './src/CustomComponent2/index'));
    // console.log(custom3Entry, path.join(__dirname, './src/CustomComponent2/index'));
    const vPath = path.join(custom3Entry.configHelper.cwd, './src', custom4Entry.outputDir);
    const custom3Using = custom3Entry.genOutputConfig().usingComponents;
    const importPath = path.join(custom3Entry.dirPath, custom3Using.custom3);

    expect(importPath.startsWith(vPath)).toBeTruthy();
  });
  it('out of src', () => {
    // console.log( monaStore.nativeEntryMap)
    const custom4Entry = monaStore.nativeEntryMap.get(path.join(__dirname, './CustomComponent4/index'));
    const custom3Entry = monaStore.nativeEntryMap.get(path.join(__dirname, './src/CustomComponent3/index'));

    const vPath = path.join(custom3Entry.configHelper.cwd, './src', custom4Entry.outputDir);
    const custom3Using = custom3Entry.genOutputConfig().usingComponents;
    const importPath = path.join(custom3Entry.dirPath, custom3Using.custom4);

    expect(importPath.startsWith(vPath)).toBeTruthy();
  });
  it('outputResource', () => {
    const custom3Entry = monaStore.nativeEntryMap.get(path.join(__dirname, './src/CustomComponent3/index'));
    const custom4Entry = monaStore.nativeEntryMap.get(path.join(__dirname, './CustomComponent4/index'));

    expect(custom3Entry.outputResource.length).toBe(4);
    expect(custom4Entry.outputResource.length).toBe(3);
  });

  it('virtualSource', () => {
    const custom4Entry = monaStore.nativeEntryMap.get(path.join(__dirname, './CustomComponent4/index'));
    expect(typeof custom4Entry.virtualSource === 'string').toBeTruthy();
    expect(custom4Entry.virtualSource.length > 0).toBeTruthy();
  });
});
