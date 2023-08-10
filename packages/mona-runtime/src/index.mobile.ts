import events from '@bytedance/mona-plugin-events';
export * from '@bytedance/mona-client-web';

export { usePageEvent, useAppEvent, AppLifecycle, PageLifecycle } from '@bytedance/mona';

export const pigeon = {};

export const light = events.light || events.app;
