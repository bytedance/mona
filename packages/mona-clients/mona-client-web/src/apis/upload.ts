import { getLightHeaders } from './light';

const pipeResponse = async (response: Response) => {
  if (!response.ok) {
    return Promise.reject(new Error(`${response.status} ${response.statusText}  \n  ${response.url ?? ''} `));
  }
  const respData = await response.json();
  const BizError = respData?.BizError;

  const { code } = BizError || {};

  if (!code) {
    return respData;
  } else {
    return Promise.reject(new Error(BizError?.message));
  }
};

export async function getDownLoadFileUrl(fileKey: string) {
  const domain = window.__MONA_LIGNT_APP_DOMAIN_NAME || 'lgw.jinritemai.com';
  const url = `https://${domain}/light/download/file/url`;

  const appId = window.__MONA_LIGHT_APP_LIFE_CYCLE_LANUCH_QUERY?.appId;
  if (appId && fileKey) {
    const headers: Record<string, any> = await getLightHeaders();

    const data = await fetch(`${url}?appId=${appId}&fileKey=${fileKey}`, {
      headers,
      credentials: 'include',
    }).then(pipeResponse);
    return data?.url;
  }
}

export async function uploadFileTemporary(file: File) {
  const domain = window.__MONA_LIGNT_APP_DOMAIN_NAME || 'lgw.jinritemai.com';
  const appId = window.__MONA_LIGHT_APP_LIFE_CYCLE_LANUCH_QUERY?.appId;
  const filePath = file.name;
  //获取最后一个.的位置
  const index = filePath.lastIndexOf('.');
  //获取后缀
  const ext = filePath.slice(index);
  // light app
  if (window.__MONA_LIGHT_APP_GET_TOEKN && appId) {
    const url = `https://${domain}/light/upload/file/url`;

    const headers: Record<string, any> = await getLightHeaders();
    const data = await fetch(`${url}?appId=${appId}&extension=${ext}`, {
      headers,
      credentials: 'include',
    }).then(pipeResponse);
    if (data) {
      var crc32 = require('./crc32.js').crc32;
      const buffer = await file.arrayBuffer();
      const crc32Res = crc32(buffer);
      console.log('crc32 :>> ', crc32Res);
      const { headerAuthorization, headerHost, url } = data;
      const headers: Record<string, any> = {
        host: headerHost,
        Authorization: `${headerAuthorization}`,
        'Content-CRC32': crc32Res,
        // 'Content-Type': 'image/png',
      };

      const uploadData = await fetch(url.replace('http://', 'https://'), {
        method: 'PUT',
        headers,
        body: buffer,
      }).then(res => res.json());
      const resultUrl = await getDownLoadFileUrl(uploadData?.payload?.key);
      return resultUrl;
    }
  }
}
