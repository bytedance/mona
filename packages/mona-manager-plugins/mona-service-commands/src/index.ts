const start = require('./start');
const build = require('./build');
const compress = require('./compress');
const preview = require('./preview');
const publish = require('./publish');
const mock = require('./mock');
module.exports = [start, build, compress, preview, publish, mock];
