const spawn = require('child_process').spawn;

const pkgs = {
  mona: '@bytedance/mona',
  cli: '@bytedance/mona-cli',
  mini: '@bytedance/mona-client-mini',
  web: '@bytedance/mona-client-web',
  max: '@bytedance/mona-client-max',
  plugin: '@bytedance/mona-client-plugin',
  events: '@bytedance/mona-plugin-events',
  runtime: '@bytedance/mona-runtime',
  shared: '@bytedance/mona-shared',
  build: '@bytedance/mona-build',
  service: '@bytedance/mona-service',
  manager: '@bytedance/mona-manager',
  'cli-commands': '@bytedance/mona-cli-commands',
  'service-commands': '@bytedance/mona-service-commands',
  'target-web': '@bytedance/mona-service-target-web',
  'target-mini': '@bytedance/mona-service-target-mini',
  'target-lynx': '@bytedance/mona-service-target-lynx',
};
const rawTargets = process.argv.slice(2);
const startIndex = rawTargets.indexOf('-s');
const isStart = startIndex !== -1;
if (isStart) {
  rawTargets.splice(startIndex, 1);
}
const targets = rawTargets.map(key => pkgs[key]).filter(r => !!r);
console.log(`now ${isStart ? 'start' : 'build'} for`, targets);
console.log('');
const cmds = targets.map(t => `yarn workspace ${t} ${isStart ? 'start' : 'build'}`);

// pipe func
const pipe = funcs => input =>
  funcs.reduce((prev, cur) => i => {
    const res = prev(i);
    const isPromise = typeof res.then === 'function';
    if (isPromise) {
      return res.then(r => cur(r));
    } else {
      return cur(res);
    }
  })(input);

pipe(
  cmds.map(
    cmd => () =>
      new Promise((resolve, reject) => {
        const parts = cmd.split(/\s+/g);
        console.log(cmd);
        const result = spawn(parts[0], parts.slice(1), { stdio: 'inherit' });
        result.on('exit', resolve);
      }),
  ),
)();
