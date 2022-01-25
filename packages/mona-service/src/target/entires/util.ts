import ConfigHelper from '../../ConfigHelper';
import { TtComponentEntry } from './ttComponentEntry';
import { TtPageEntry } from './ttPageEntry';

import monaStore from '../store';
const { nativeEntryMap } = monaStore;

export const genNativeComponentEntry = (configHelper: ConfigHelper, entryPath: string) => {
  if (nativeEntryMap.has(entryPath)) {
    return nativeEntryMap.get(entryPath)! as TtComponentEntry;
  } else {
    const nEntry = new TtComponentEntry(configHelper, entryPath);
    nativeEntryMap.set(entryPath, nEntry);
    return nEntry;
  }
};

export const genTtPageEntry = (configHelper: ConfigHelper, entryPath: string) => {
  if (nativeEntryMap.has(entryPath)) {
    return nativeEntryMap.get(entryPath)! as TtPageEntry;
  } else {
    const nEntry = new TtPageEntry(configHelper, entryPath);
    nativeEntryMap.set(entryPath, nEntry);
    return nEntry;
  }
};
