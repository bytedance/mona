import { execSync } from 'child_process';
import { join } from 'path';
import { startCommandUsage, buildCommandUsage } from './help';

test('command', () => {
  expect(buildCommandUsage).not.toThrow();
  expect(startCommandUsage).not.toThrow();
});

test('build project', () => {
  execSync(`cd ${join(__dirname, '../')} && npm run build`, { stdio: 'ignore' });
});
