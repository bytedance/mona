import { CUSTOM_COMPONENT_PROTOCOL } from '@bytedance/mona-shared';
import nodePath from 'path';

export function processNativePath(req: string, from: string) {
  const sourcePath = req.replace(CUSTOM_COMPONENT_PROTOCOL, '');
  if (sourcePath.startsWith('../') || sourcePath.startsWith('./')) {
    return nodePath.join(from, sourcePath);
  } else {
    return sourcePath;
  }
}
