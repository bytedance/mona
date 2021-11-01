const fs = require('fs');
const path = require('path');
const result = fs.readFileSync(path.join(__dirname, './package.json')).toString();
fs.writeFileSync(path.join(__dirname, 'src/currentVersion.ts'), `const version = '${JSON.parse(result).version}';\nexport default version;`)