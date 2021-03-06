declare module '*.less';
declare module 'xgplayer-mp4' {
  const r: any;
  export = r;
}
declare module 'xgplayer/dist/*' {
  const r: any;
  export = r;
}

declare interface Window {
  __MARFISH__: boolean;
  __mona_history: any;
  __MONA_EVENTEMITTER_LISTENER: { [key: string]: Function[] };
}
