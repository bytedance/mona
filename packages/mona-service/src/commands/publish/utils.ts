import axios from 'axios';
import path from 'path';
import { OPEN_DOMAIN, OPEN_DEV_HEADERS } from '@bytedance/mona-shared';
import { createUploadForm } from '../common';

export async function upload(output: string, userId: string, args: any) {
  const domain = args.domain || OPEN_DOMAIN;
  const header = args.header ? JSON.parse(args.header) : OPEN_DEV_HEADERS;
  const fileName = path.basename(output);
  const isOnline = domain.indexOf('jinritemai.com') !== -1;
 
  const { form, requestOptions } = await createUploadForm({
    'app_id': isOnline ? '8' : '65',
    'channel_key': 'open',
    'ftype': '2',
    'uid': userId,
    'file': {
      filePath: output,
      fileName
    }
  })

  const res = await axios.post(`https://${domain}/pssresource/external-large/upload`, form, {
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
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
