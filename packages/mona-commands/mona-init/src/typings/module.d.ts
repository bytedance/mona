declare module 'download-git-repo' {
  const download: (url: string, dest: string, opts: any, callback: (error: Error) => void) => void
  export = download;
}