import { compressToZipFromDir } from './utils/common';
import { commandUsage } from './help';
import fse from 'fs-extra';
test('pkg start', async () => {
  const destPath = await compressToZipFromDir(__dirname);
  expect(destPath?.length > 0).toBe(true);

  await fse.remove(destPath);
});

test('commandUsage', async () => {
  expect(commandUsage).not.toThrow();
});



//TODO publish
