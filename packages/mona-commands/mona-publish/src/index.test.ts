import { compressToZipFromDir } from './utils/common';
import { commandUsage } from './help';
import fse from 'fs-extra';
import { execSync } from 'child_process';
import { join } from 'path';

test('pkg start', async () => {
  const destPath = await compressToZipFromDir(__dirname);
  expect(destPath?.length > 0).toBe(true);

  await fse.remove(destPath);
});

test('commandUsage', async () => {
  expect(commandUsage).not.toThrow();
});

test('build project', () => {
  execSync(`cd ${join(__dirname, '../')} && npm run build`, { stdio: 'ignore' });
});

//TODO publish
