import chalk from 'chalk';

export default function log(texts: string[], colors = ['green']) {
  const text = texts.map((t, i) => `${colors[i] ? chalk[colors[i] as 'red'](t) : t}`).join('  ');
  console.log(text)
}