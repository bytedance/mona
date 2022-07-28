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
  __MONA_LIGHT_APP_GET_TOEKN?: () => string;
  __MONA_LIGNT_APP_DOMAIN_NAME?: string;
  __MONA_LIGHT_APP_NAVIGATE_CB?: (args) => void;
  __MONA_LIGHT_APP_EXIT_APP_CB?: () => void;
  __MONA_LIGHT_APP_LOCAL_STORAGE?: Storage;
  __MONA_LIGHT_APP_LIFE_CYCLE_LANUCH_QUERY: { appId: string; referrerInfo: { appId: string } };
}
