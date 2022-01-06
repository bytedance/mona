import path from 'path';
import fs from 'fs';
import { Options } from '..';

const dotenv = require('dotenv');

export default function getEnv(config: Options, dir: string) {
  const envPath = path.join(dir, '.env');

  const envFilesPath = [envPath, `${envPath}.${process.env.NODE_ENV}`];
  const injectEnv: Record<string, any> = {
    'process.env.MONA_TARGET': JSON.stringify(config.target),
  };

  envFilesPath.forEach(envPath => {
    if (fs.existsSync(envPath)) {
      const envMap = dotenv.config({ path: envPath })?.parsed ?? {};
      Object.keys(envMap).forEach(envKey => {
        injectEnv[`process.env.${envKey}`] = JSON.stringify(envMap[envKey]);
      });
    }
  });

  return injectEnv;
}
