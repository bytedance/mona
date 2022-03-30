import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { OPEN_DOMAIN, OPEN_DEV_HEADERS } from '@bytedance/mona-shared';

const homePath = (process.env.HOME ? process.env.HOME : process.env.USERPROFILE) || __dirname;
const userDataFile = path.join(homePath, '.mona_user');

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


export const generateRequestFromOpen = (args: any, cookie: string) => (path: string, options?: Record<string, any>) => {
  const domain = args.domain || OPEN_DOMAIN;
  const header = args.header ? JSON.parse(args.header) : OPEN_DEV_HEADERS;
  const url = `https://${domain}${path}`;

  const config = {
    url,
    headers: {
      cookie,
      'Content-Type': 'application/json',
      ...header
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

export async function upload(output: string, userId: string, args: any) {
  const domain = args.domain || OPEN_DOMAIN;
  const header = args.header ? JSON.parse(args.header) : OPEN_DEV_HEADERS;
  const mime = 'application/zip';
  const fileName = path.basename(output);
  const form = new FormData();
  const isOnline = domain.indexOf('jinritemai.com') !== -1;
  form.append('app_id', isOnline ? '8' : '65');
  form.append('channel_key', 'open');
  form.append('ftype', '2');
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

  const res = await axios.post(`https://${domain}/pssresource/external-large/upload`, form, {
    responseType: 'json',
    headers: {
      'Content-Type': headers['content-type'],
      'Content-Length': length,
      ...header
    },
  });

  const { data } = res;
  if (data.code === 0) {
    return { fileId: data?.data?.file_id, fileName };
  } else {
    throw new Error(`上传文件失败：${data.message}`);
  }
}
