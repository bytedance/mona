import fs from 'fs';
import * as shared from '@bytedance/mona-shared';
import ConfigHelper from "../ConfigHelper";

describe('config helper', () => {
  beforeEach(() => {
    jest.spyOn(shared, 'readConfig').mockImplementation(() => ({}));
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should create config helper correctly', () => {
    const originFsExists = fs.existsSync.bind(fs);
    jest.spyOn(fs, 'existsSync').mockImplementation(name => /(mona|app)\.config$/.test(name as string) ? true : originFsExists(name));
    const helper = new ConfigHelper();
    expect(helper).not.toBeUndefined()
  })
})