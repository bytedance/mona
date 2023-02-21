import fs from 'fs';

export default function searchScriptFile(filename: string) {
  if (filename.endsWith('.js') || filename.endsWith('.jsx') || filename.endsWith('.ts') || filename.endsWith('.tsx')) {
    return filename;
  } else {
    for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
      const fullFilename = `${filename}${ext}`;
      if (fs.existsSync(fullFilename)) {
        return fullFilename;
      }
    }
    return '';
  }
}
