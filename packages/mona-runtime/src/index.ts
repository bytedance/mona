import events from '@bytedance/mona-plugin-events';
export const pigeon = events.pigeon;
export const light = events.light;

export * from '@bytedance/mona-client-mini';
export { createPlugin } from '@bytedance/mona-client-plugin';
export { max } from '@bytedance/mona-client-max';
export {
  createWebApp,
  navigateToApp,
  exitLightApp,
  useRequest,
  lightAppLeftArrowHandle,
  request,
  app,
} from '@bytedance/mona-client-web';
export { usePageEvent, useAppEvent, AppLifecycle, PageLifecycle } from '@bytedance/mona';
export interface PageProps {
  search: string;
  searchParams: Record<string, string>;
}
