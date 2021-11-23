import { compressToZipFromDir } from './utils/common';
import { commandUsage } from './help';
import fse from 'fs-extra';
import path from 'path';

test('pkg start', async () => {
  expect((await compressToZipFromDir(__dirname))?.length > 0).toBe(true);

  await fse.remove(path.resolve(__dirname, '../', 'publish.zip'));
});

test('commandUsage', async () => {
  expect(commandUsage).not.toThrow();
});
