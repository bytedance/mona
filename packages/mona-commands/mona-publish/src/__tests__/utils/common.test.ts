import { compressToZipFromDir } from '../../utils/common';
import fse from 'fs-extra';

describe('publish', () => {
  let destPath;
  afterEach(() => {
    return fse.remove(destPath);
  });
  test('compressToZipFromDir ', async () => {
    destPath = await compressToZipFromDir(__dirname);
    expect(destPath?.length > 0).toBe(true);
  });
});
