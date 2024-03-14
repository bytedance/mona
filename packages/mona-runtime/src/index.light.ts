import events from '@bytedance/mona-plugin-events';
export * from '@bytedance/mona-client-web';

export const light = events.light;
export const pigeon = events.pigeon;

export { usePageEvent, useAppEvent, AppLifecycle, PageLifecycle } from '@bytedance/mona';
