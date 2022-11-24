const pkgs = {
  mona: '@bytedance/mona',
  cli: '@bytedance/mona-cli',
  mini: '@bytedance/mona-client-mini',
  web: '@bytedance/mona-client-web',
  plugin: '@bytedance/mona-client-plugin',
  events: '@bytedance/mona-plugin-events',
  runtime: '@bytedance/mona-runtime',
  shared: '@bytedance/mona-shared',
  build: '@bytedance/mona-build',
  service: '@bytedance/mona-service',
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

// execute a single shell command where "cmd" is a string
const exec = function (cmd, cb) {
  // this would be way easier on a shell/bash script :P
  var child_process = require('child_process');
  var parts = cmd.split(/\s+/g);
  var p = child_process.spawn(parts[0], parts.slice(1), { stdio: 'inherit' });
  p.on('exit', function (code) {
    var err = null;
    if (code) {
      err = new Error('command "' + cmd + '" exited with wrong status code "' + code + '"');
      err.code = code;
      err.cmd = cmd;
    }
    if (cb) cb(err);
  });
};

// execute multiple commands in series
// this could be replaced by any flow control lib
const series = function (cmds, cb) {
  var execNext = function () {
    exec(cmds.shift(), function (err) {
      if (err) {
        cb(err);
      } else {
        if (cmds.length) execNext();
        else cb(null);
      }
    });
  };
  execNext();
};

series(cmds, function (err) {
  console.log('executed many commands in a row');
});
