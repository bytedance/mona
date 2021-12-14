import path from 'path';
import fse from 'fs-extra';
import { Options } from '..';

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
export default async function getEnv(config: Options, dir: string) {
  const envPath = path.join(dir, '.env');

  const envFilesPath = [`${envPath}.${process.env.NODE_ENV}`];
  envFilesPath.forEach(envPath => {
    if (fse.existsSync(envPath)) {
      dotenvExpand(dotenv.config({ path: envPath }));
    }
  });

  const injectEnv: Record<string, any> = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PLAT_FORM: config.target,
  };

  Object.keys(process.env).forEach(envKey => {
    injectEnv[`process.env.${envKey}`] = process.env[envKey];
  });

  Object.keys(injectEnv).forEach(envKey => {
    injectEnv[envKey] = JSON.stringify(injectEnv[envKey]);
  });

  return injectEnv;
}
