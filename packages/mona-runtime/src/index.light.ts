import events from '@bytedance/mona-plugin-events';
export * from '@bytedance/mona-client-web';

export const light = events.light || {};
export const pigeon = events.pigeon || {};
export const app = events.app || {};

export const tt = events.light || events.pigeon || events.app;

export { usePageEvent, useAppEvent, AppLifecycle, PageLifecycle } from '@bytedance/mona';
