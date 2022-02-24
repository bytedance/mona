import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { OPEN_DOMAIN, OPEN_DEV_HEADERS } from '@bytedance/mona-shared';

const userDataFile = path.join(__dirname, '.mona_user');

export function deleteUser() {
  if (fs.existsSync(userDataFile)) {
    fs.unlinkSync(userDataFile);
  }
}

export function readUser(): { cookie: string, nickName: string, userId: string } | null {
  try {
    const str = fs.readFileSync(userDataFile);
    const result = str ? JSON.parse(str.toString()) : null;
    if (result && result.cookie && result.nickName && result.userId) {
      return result;
    }
  } catch(_) {
    // do nothing
  }
  return null;
}

export function saveUser(data: any) {
  fs.writeFileSync(userDataFile, JSON.stringify(data));
}


export const generateRequestFromOpen = (cookie: string) => (path: string, options?: Record<string, any>) => {
  const url = `https://${OPEN_DOMAIN}${path}`;
  const config = {
    url,
    headers: {
      cookie,
      'Content-Type': 'application/json',
      ...OPEN_DEV_HEADERS,
    },
    ...options,
  }

  return axios.request(config)
    .then(res => {
      const data = res.data as any;
      if (data.code === 0) {
        return data.data;
      } else {
        throw new Error(data.message || '未知错误');
      }
    });
};

export async function upload(output: string, userId: string) {
  const mime = 'application/zip';
  const fileName = path.basename(output);
  const form = new FormData();
  // 8
  form.append('app_id', '65');
  form.append('channel_key', 'open');
  form.append('ftype', '2');
  // TODO
  form.append('uid', userId);
  form.append('file', fs.createReadStream(output), {
    contentType: mime,
    filename: fileName,
  });

  // 获取内容length
  const length: number = await new Promise((resolve, reject) => {
    form.getLength((err, length) => {
      if (err) {
        reject(err);
      } else {
        resolve(length);
      }
    });
  });
  const headers = form.getHeaders();

  const res = await axios.post(`https://${OPEN_DOMAIN}/pssresource/external-large/upload`, form, {
    responseType: 'json',
    headers: {
      'Content-Type': headers['content-type'],
      'Content-Length': length,
    },
  });

  const { data } = res;
  if (data.code === 0) {
    return { fileId: data?.data?.file_id, fileName };
  } else {
    throw new Error(data.message);
  }
}
