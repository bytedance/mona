import fs from 'fs';

export default function searchScriptFile(filename: string) {
  for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
    const fullFilename = `${filename}${ext}`;
    if (fs.existsSync(fullFilename)) {
      return fullFilename;
    }
  }
  return filename;
}