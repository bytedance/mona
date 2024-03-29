import fs from 'fs';
import path from 'path';

const homePath = (process.env.HOME ? process.env.HOME : process.env.USERPROFILE) || __dirname;
const userDataFile = path.join(homePath, '.mona_user');

export function readUser(): { cookie: string; nickName: string; userId: string } | null {
  try {
    const str = fs.readFileSync(userDataFile);
    const result = str ? JSON.parse(str.toString()) : null;
    if (result && result.cookie && result.nickName && result.userId) {
      return result;
    }
  } catch (_) {
    // do nothing
  }
  return null;
}

export function saveUser(data: any) {
  fs.writeFileSync(userDataFile, JSON.stringify(data));
}

export function deleteUser() {
  if (fs.existsSync(userDataFile)) {
    fs.unlinkSync(userDataFile);
  }
}
