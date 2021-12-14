import path from 'path';
import fse from 'fs-extra';
import { Options } from '..';

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

export default function getEnv(config: Options, dir: string) {
  const envPath = path.join(dir, '.env');

  const envFilesPath = [envPath, `${envPath}.${process.env.NODE_ENV}`];
  envFilesPath.forEach(envPath => {
    if (fse.existsSync(envPath)) {
      dotenvExpand(dotenv.config({ path: envPath }));
    }
  });

  const injectEnv: Record<string, any> = {
    NODE_ENV: process.env.NODE_ENV || (config.dev ? 'development' : 'production'),
    PLAT_FORM: config.target,
    BUILD_TARGET: config.target,
  };

  Object.keys(process.env).forEach(envKey => {
    injectEnv[`process.env.${envKey}`] = process.env[envKey];
  });

  Object.keys(injectEnv).forEach(envKey => {
    injectEnv[envKey] = JSON.stringify(injectEnv[envKey]);
  });

  return injectEnv;
}
