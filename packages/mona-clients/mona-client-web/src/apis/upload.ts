export async function getUploadUrl() {
  let token = '';
  const domain = window.__MONA_LIGNT_APP_DOMAIN_NAME || 'lgw.jinritemai.com';
  const appId = window.__MONA_LIGHT_APP_LIFE_CYCLE_LANUCH_QUERY?.appId;

  // light app
  if (window.__MONA_LIGHT_APP_GET_TOEKN && appId) {
    const url = `https://${domain}/light/upload/file/url`;

    token = await window.__MONA_LIGHT_APP_GET_TOEKN();
    const headers: Record<string, any> = {
      'x-open-token': token,
      'x-use-test': window.__MONA_LIGHT_USE_TEST,
      'x-open-compass': window.__MONA_LIGHT_APP_GET_COMPASS_TOKEN ? window.__MONA_LIGHT_APP_GET_COMPASS_TOKEN() : '',
    };
    return fetch(`${url}?appId=${appId}`, {
      headers,
      credentials: 'include',
    });
  }
}
